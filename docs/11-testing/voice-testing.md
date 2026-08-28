# Medicare — Voice Testing

## Objective

Validate Medicare's voice-first, not voice-only reminder experience. Voice output must communicate trusted configured medication information, while visible actions remain available when voice features fail. The approved baseline requires TTS, supported regional-language output, defined STT commands, listening-state feedback and visible fallbacks. fileciteturn0file11

## Test Matrix

| ID | Scenario | Expected Result | Priority |
|---|---|---|---|
| VOICE-01 | TTS enabled with supported language | Reminder speaks medicine name, scheduled time and dosage | P0 |
| VOICE-02 | Optional identification detail enabled | Configured color/identification aid may be spoken | P1 |
| VOICE-03 | Change supported voice/language | New setting is used for subsequent reminders | P1 |
| VOICE-04 | Adjust speech speed | Speech speed changes according to supported device behavior | P1 |
| VOICE-05 | Adjust reminder volume | Output follows configured setting/device limits | P1 |
| VOICE-06 | Configure repeat count | Reminder repeats according to configured policy | P1 |
| VOICE-07 | TTS unavailable | Reminder remains understandable visually; Taken/Snooze/Skip remain available | P0 |
| VOICE-08 | Start supported STT command | Listening state is clearly visible | P1 |
| VOICE-09 | Valid defined voice command | Intended supported action is recognized and handled | P1 |
| VOICE-10 | Unrecognized command | User gets clear recovery guidance and visible fallback controls | P0 |
| VOICE-11 | Microphone lifecycle | Microphone activates only during explicit approved flow | P0 |
| VOICE-12 | Continuous listening check | No continuous microphone listening occurs | P0 |
| VOICE-13 | Family voice enabled | Authorized recording can play for eligible reminder | P1 |
| VOICE-14 | Family voice unavailable | Standard supported reminder path remains usable | P1 |
| VOICE-15 | Offline reminder | TTS/visual reminder still attempts local execution without network | P0 |
| VOICE-16 | Medical-safety content | Voice uses stored reminder data and does not add clinical advice | P0 |

## Reminder Voice Content

The reminder should be generated only from trusted stored fields, for example:

```text
<user-facing greeting>, it is <scheduled time>.
Please take <dosage> of <medicine name>.
```

Optional identification information may be included when configured. Do not generate diagnosis, prescription or dosage-change advice.

## STT Interaction Rules

- Show an explicit listening state.
- Provide examples of supported commands.
- Provide a visible Tap/Select fallback.
- Stop listening after the approved command interaction.
- Do not retain transcripts unless a separately approved feature requires it.

## Privacy Checks

- Do not log raw audio, tokens or unnecessary speech content.
- Do not enable microphone access merely because the app supports voice features.
- Family voice assets remain private and access-controlled.
- Document if any speech processing leaves the device.

## Voice Evidence Template

| Test ID | Device | Android | Language | Result | Evidence | Defect |
|---|---|---|---|---|---|---|
| VOICE-01 | [actual] | [actual] | [actual] | [PASS/FAIL] | [audio/video] | [ID/None] |
| VOICE-07 | [actual] | [actual] | [actual] | [PASS/FAIL] | [screenshot] | [ID/None] |
| VOICE-09 | [actual] | [actual] | [actual] | [PASS/FAIL] | [video/log] | [ID/None] |
| VOICE-12 | [actual] | [actual] | N/A | [PASS/FAIL] | [permission/lifecycle evidence] | [ID/None] |

Actual execution evidence must be recorded before marking a test as passed.
