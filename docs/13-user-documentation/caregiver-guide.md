# Medicare — Caregiver Guide

## Purpose

This guide explains how an explicitly authorized caregiver can support a senior citizen using Medicare. Caregiver access is optional, scoped and revocable.

## 1. What a Caregiver Can Do

Depending on the permissions granted by the senior, a caregiver may:

- Assist with initial profile/medicine setup.
- View permitted medication status.
- Review permitted medication history.
- Receive configured missed-dose alerts.
- Help the senior with accessibility and voice settings.

A caregiver does not automatically receive access to medication data.

## 2. Authorization

Caregiver access requires:

1. An authenticated caregiver account.
2. Explicit authorization from the senior user.
3. A defined permission scope.
4. An active relationship that has not been revoked.

The backend independently checks these conditions for protected requests. A caregiver must not rely on a senior ID or screen state supplied by the client.

## 3. Setting Up Caregiver Access

1. Senior opens **Caregiver** settings.
2. Senior selects **Add/Authorize Caregiver**.
3. Senior selects the permitted access scope.
4. Caregiver identity is associated through the approved authentication flow.
5. The authorization is saved only after the required validation succeeds.

## 4. Missed-Dose Alerts

Where enabled, a missed dose can produce a caregiver notification after the reminder's acknowledgement window is reached.

The notification should contain the minimum information required for the configured support purpose. Remote alerting must not replace or block the senior's local reminder.

## 5. Revoking Access

The senior can revoke a caregiver relationship. After revocation:

- further protected API access must be rejected;
- cached screens must not grant ongoing access;
- future alerts should stop according to the configured relationship state.

## 6. Privacy Expectations

Caregivers should:

- use only information required to support the senior;
- avoid sharing medication data unnecessarily;
- protect their own account credentials;
- report unexpected access or notifications.

## 7. Medical-Safety Boundary

Medicare is a reminder and organization tool. Caregivers should not use the application as evidence that the medicine, dosage or frequency has been clinically validated. The application does not diagnose, prescribe or autonomously change medication instructions.

## 8. Troubleshooting

If medication status is not visible:

- verify the caregiver account is authenticated;
- verify authorization is still active;
- verify the required permission scope exists;
- check connectivity for remote data synchronization.

If a local reminder does not appear on the senior device, troubleshoot the senior's Android alarm/notification, voice and battery/background configuration first. Cloud caregiver features are secondary to local reminder execution.

## 9. Support Checklist

- [ ] Senior understands the reminder actions.
- [ ] Caregiver authorization is explicit.
- [ ] Permission scope is understood.
- [ ] Missed-dose alert behavior is understood.
- [ ] Revocation process is known.
- [ ] Senior's accessibility/voice settings are appropriate.
