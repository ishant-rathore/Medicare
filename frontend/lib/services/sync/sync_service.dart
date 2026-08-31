// =============================================================================
// frontend/lib/services/sync/sync_service.dart
// Offline sync — processes SQLite queue and uploads to backend when online
// =============================================================================

import 'dart:convert';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

import '../../data/local/database_service.dart';
import '../../data/remote/api_client.dart';

class SyncService {
  static SyncService? _instance;
  final DatabaseService _db;
  final ApiClient _api;

  SyncService._({required DatabaseService db, required ApiClient api})
      : _db = db,
        _api = api;

  factory SyncService({required DatabaseService db, required ApiClient api}) {
    _instance ??= SyncService._(db: db, api: api);
    return _instance!;
  }

  bool _isSyncing = false;

  /// Check network and trigger a sync if online.
  Future<void> syncIfOnline() async {
    final connectivity = await Connectivity().checkConnectivity();
    if (connectivity == ConnectivityResult.none) {
      debugPrint('SyncService: Offline — sync deferred');
      return;
    }
    await sync();
  }

  /// Process all pending items in the sync queue.
  Future<SyncResult> sync() async {
    if (_isSyncing) {
      debugPrint('SyncService: Sync already in progress');
      return SyncResult(processed: 0, succeeded: 0, failed: 0);
    }

    _isSyncing = true;
    int processed = 0;
    int succeeded = 0;
    int failed = 0;

    try {
      final database = await _db.database;

      // Get all pending items (respect retry limits)
      final pendingItems = await database.query(
        'sync_queue',
        where: 'status = ? AND retry_count < max_retries',
        whereArgs: ['PENDING'],
        orderBy: 'created_at ASC',
        limit: 200, // Max batch size
      );

      if (pendingItems.isEmpty) {
        debugPrint('SyncService: No pending items to sync');
        return SyncResult(processed: 0, succeeded: 0, failed: 0);
      }

      debugPrint('SyncService: Processing ${pendingItems.length} pending items...');

      // Build batch for server
      final batchItems = pendingItems.map((item) => {
        'localId': item['local_id'] as String,
        'operation': item['operation'] as String,
        'resource': item['resource'] as String,
        'payload': jsonDecode(item['payload'] as String),
      }).toList();

      // Mark items as PROCESSING
      final ids = pendingItems.map((i) => "'${i['id']}'").join(',');
      await database.rawUpdate(
        'UPDATE sync_queue SET status = ? WHERE id IN ($ids)',
        ['PROCESSING'],
      );

      try {
        // Upload batch to server
        final response = await _api.post('/sync/batch', {'items': batchItems});
        final results = response['data']['results'] as List<dynamic>;

        // Process results
        await database.transaction((txn) async {
          for (final result in results) {
            final localId = result['localId'] as String;
            final success = result['success'] as bool;

            final item = pendingItems.firstWhere(
              (i) => i['local_id'] == localId,
              orElse: () => {},
            );
            if (item.isEmpty) continue;

            processed++;

            if (success) {
              succeeded++;
              await txn.rawUpdate(
                'UPDATE sync_queue SET status = ?, processed_at = ? WHERE id = ?',
                ['COMPLETED', DateTime.now().toIso8601String(), item['id']],
              );

              // Mark the corresponding dose_event as synced
              if (item['resource'] == 'dose_event') {
                await txn.rawUpdate(
                  'UPDATE dose_events SET synced = 1 WHERE id = ?',
                  [item['local_id']],
                );
              }
            } else {
              failed++;
              final retryCount = (item['retry_count'] as int) + 1;
              await txn.rawUpdate(
                'UPDATE sync_queue SET status = ?, retry_count = ?, last_error = ? WHERE id = ?',
                ['PENDING', retryCount, result['error'] ?? 'Unknown error', item['id']],
              );
            }
          }
        });
      } catch (apiError) {
        // Reset PROCESSING items to PENDING on network failure
        await database.rawUpdate(
          'UPDATE sync_queue SET status = ? WHERE id IN ($ids)',
          ['PENDING'],
        );
        debugPrint('SyncService: Network error — items reset to PENDING: $apiError');
        return SyncResult(processed: 0, succeeded: 0, failed: pendingItems.length);
      }

      debugPrint('SyncService: Sync complete — processed=$processed, succeeded=$succeeded, failed=$failed');
      return SyncResult(processed: processed, succeeded: succeeded, failed: failed);
    } catch (e) {
      debugPrint('SyncService: Sync error: $e');
      return SyncResult(processed: processed, succeeded: succeeded, failed: failed + 1);
    } finally {
      _isSyncing = false;
    }
  }

  /// Add an item to the sync queue.
  Future<void> enqueue({
    required String localId,
    required String operation,
    required String resource,
    required Map<String, dynamic> payload,
  }) async {
    final database = await _db.database;
    final id = 'sq_${DateTime.now().millisecondsSinceEpoch}_$localId';

    await database.insert(
      'sync_queue',
      {
        'id': id,
        'local_id': localId,
        'operation': operation,
        'resource': resource,
        'payload': jsonEncode(payload),
        'status': 'PENDING',
        'retry_count': 0,
        'max_retries': 5,
        'created_at': DateTime.now().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );

    debugPrint('SyncService: Enqueued $operation $resource (localId=$localId)');
  }
}

class SyncResult {
  final int processed;
  final int succeeded;
  final int failed;

  const SyncResult({
    required this.processed,
    required this.succeeded,
    required this.failed,
  });
}

// ConflictAlgorithm — needed for sqflite
class ConflictAlgorithm {
  static const int replace = 5;
}
