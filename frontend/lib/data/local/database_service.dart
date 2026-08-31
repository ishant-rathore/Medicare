// =============================================================================
// frontend/lib/data/local/database_service.dart
// SQLite database initialization and migration management
// =============================================================================

import 'package:flutter/services.dart' show rootBundle;
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseService {
  static DatabaseService? _instance;
  Database? _database;

  DatabaseService._();

  factory DatabaseService() => _instance ??= DatabaseService._();

  static const String _dbName = 'medicare.db';
  static const int _dbVersion = 1;

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, _dbName);

    return openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
      onConfigure: _onConfigure,
    );
  }

  /// Enable WAL mode and foreign keys — called before any other database setup
  Future<void> _onConfigure(Database db) async {
    await db.execute('PRAGMA foreign_keys = ON');
    await db.execute('PRAGMA journal_mode = WAL');
  }

  Future<void> _onCreate(Database db, int version) async {
    // Load and execute the schema from assets
    await db.transaction((txn) async {
      // MEDICINES
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          generic_name TEXT,
          dosage TEXT NOT NULL,
          type TEXT NOT NULL,
          color TEXT,
          shape TEXT,
          category TEXT,
          meal_timing TEXT NOT NULL,
          instructions TEXT NOT NULL DEFAULT '[]',
          stock_count INTEGER NOT NULL DEFAULT 30,
          low_stock_threshold INTEGER NOT NULL DEFAULT 5,
          expiry_date TEXT,
          is_essential INTEGER NOT NULL DEFAULT 0,
          is_active INTEGER NOT NULL DEFAULT 1,
          notes TEXT,
          photo_url TEXT,
          prescribed_by TEXT,
          custom_voice_script TEXT,
          start_date TEXT,
          end_date TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        )
      ''');

      await txn.execute(
        'CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines(is_active)',
      );

      // REMINDERS
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS reminders (
          id TEXT PRIMARY KEY,
          medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
          scheduled_times TEXT NOT NULL DEFAULT '[]',
          recurrence TEXT NOT NULL,
          days_of_week TEXT NOT NULL DEFAULT '[]',
          start_date TEXT NOT NULL,
          end_date TEXT,
          is_active INTEGER NOT NULL DEFAULT 1,
          snooze_minutes INTEGER NOT NULL DEFAULT 10,
          notes TEXT,
          alarm_id INTEGER,
          medicine_name TEXT,
          dosage TEXT,
          meal_timing TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          deleted_at TEXT
        )
      ''');

      await txn.execute(
        'CREATE INDEX IF NOT EXISTS idx_reminders_medicine ON reminders(medicine_id)',
      );

      // DOSE EVENTS
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS dose_events (
          id TEXT PRIMARY KEY,
          local_event_id TEXT NOT NULL UNIQUE,
          medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
          reminder_id TEXT REFERENCES reminders(id) ON DELETE SET NULL,
          medicine_name TEXT NOT NULL,
          dosage TEXT NOT NULL,
          meal_timing TEXT NOT NULL,
          scheduled_time TEXT NOT NULL,
          scheduled_date TEXT NOT NULL,
          period TEXT NOT NULL DEFAULT 'Morning',
          status TEXT NOT NULL DEFAULT 'PENDING',
          action_at TEXT,
          snooze_until TEXT,
          spoken_script TEXT,
          photo_url TEXT,
          notes TEXT,
          synced INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      ''');

      await txn.execute(
        'CREATE INDEX IF NOT EXISTS idx_dose_events_date ON dose_events(scheduled_date)',
      );
      await txn.execute(
        'CREATE INDEX IF NOT EXISTS idx_dose_events_synced ON dose_events(synced)',
      );

      // SYNC QUEUE
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS sync_queue (
          id TEXT PRIMARY KEY,
          local_id TEXT NOT NULL,
          operation TEXT NOT NULL,
          resource TEXT NOT NULL,
          payload TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'PENDING',
          retry_count INTEGER NOT NULL DEFAULT 0,
          max_retries INTEGER NOT NULL DEFAULT 5,
          last_error TEXT,
          created_at TEXT NOT NULL,
          processed_at TEXT
        )
      ''');

      await txn.execute(
        'CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status)',
      );

      // USER PROFILE
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS user_profile (
          id TEXT PRIMARY KEY,
          firebase_uid TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          nickname TEXT,
          age INTEGER,
          gender TEXT,
          blood_group TEXT,
          phone TEXT,
          email TEXT,
          address TEXT,
          preferred_language TEXT NOT NULL DEFAULT 'en',
          photo_url TEXT,
          health_conditions TEXT NOT NULL DEFAULT '[]',
          caregiver_name TEXT,
          caregiver_phone TEXT,
          caregiver_relation TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      ''');

      // ACCESSIBILITY SETTINGS
      await txn.execute('''
        CREATE TABLE IF NOT EXISTS accessibility_settings (
          id TEXT PRIMARY KEY DEFAULT 'singleton',
          font_size TEXT NOT NULL DEFAULT 'large',
          high_contrast INTEGER NOT NULL DEFAULT 0,
          dark_mode INTEGER NOT NULL DEFAULT 0,
          vibration INTEGER NOT NULL DEFAULT 1,
          screen_reader INTEGER NOT NULL DEFAULT 0,
          voice_guidance INTEGER NOT NULL DEFAULT 1,
          language TEXT NOT NULL DEFAULT 'en',
          voice_speed TEXT NOT NULL DEFAULT 'normal',
          alarm_volume TEXT NOT NULL DEFAULT 'normal',
          button_size TEXT NOT NULL DEFAULT 'large',
          updated_at TEXT NOT NULL
        )
      ''');

      // Insert default accessibility settings
      await txn.execute('''
        INSERT OR IGNORE INTO accessibility_settings (id, updated_at)
        VALUES ('singleton', '${DateTime.now().toIso8601String()}')
      ''');
    });
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Migration logic for future schema versions
    // Example: if (oldVersion < 2) { await db.execute('ALTER TABLE...'); }
  }

  Future<void> close() async {
    await _database?.close();
    _database = null;
    _instance = null;
  }
}
