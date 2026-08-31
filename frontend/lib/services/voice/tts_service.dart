// =============================================================================
// frontend/lib/services/voice/tts_service.dart
// Text-to-Speech service — speaks medicine reminders aloud
// Senior-friendly: slower speed, clear pronunciation
// =============================================================================

import 'package:flutter/foundation.dart';
import 'package:flutter_tts/flutter_tts.dart';

class TtsService {
  static TtsService? _instance;
  final FlutterTts _flutterTts = FlutterTts();
  bool _initialized = false;

  TtsService._();

  factory TtsService() => _instance ??= TtsService._();

  Future<void> initialize() async {
    if (_initialized) return;

    await _flutterTts.setLanguage('en-IN');
    await _flutterTts.setSpeechRate(0.45);   // Slower for seniors
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSharedInstance(true);

    // Handle engine events
    _flutterTts.setStartHandler(() {
      debugPrint('TTS: Speaking started');
    });

    _flutterTts.setCompletionHandler(() {
      debugPrint('TTS: Speaking completed');
    });

    _flutterTts.setErrorHandler((message) {
      debugPrint('TTS: Error — $message');
    });

    _initialized = true;
  }

  /// Speak a medicine reminder script.
  Future<void> speakReminder(String script) async {
    await initialize();
    await stop(); // Stop any ongoing speech
    await _flutterTts.speak(script);
  }

  /// Speak a confirmation message.
  Future<void> speakConfirmation(String message) async {
    await initialize();
    await _flutterTts.speak(message);
  }

  /// Stop speaking.
  Future<void> stop() async {
    await _flutterTts.stop();
  }

  /// Pause speaking.
  Future<void> pause() async {
    await _flutterTts.pause();
  }

  /// Change language for multilingual support.
  Future<void> setLanguage(String languageCode) async {
    await initialize();
    await _flutterTts.setLanguage(languageCode);
  }

  /// Change speech rate (senior-friendly: 0.3–0.5).
  Future<void> setSpeechRate(double rate) async {
    await initialize();
    final clampedRate = rate.clamp(0.1, 1.0);
    await _flutterTts.setSpeechRate(clampedRate);
  }

  /// Get available languages.
  Future<List<String>> getAvailableLanguages() async {
    await initialize();
    final languages = await _flutterTts.getLanguages;
    return (languages as List).cast<String>();
  }

  Future<void> dispose() async {
    await _flutterTts.stop();
    _initialized = false;
    _instance = null;
  }
}
