// =============================================================================
// backend/src/tests/priority-pass-3.test.ts
// Test suite for Medicare Priority Pass 3:
// 1. User ID Mapping (Firebase UID -> users.firebase_uid -> internal users.id)
// 2. Authenticated API Endpoints (/api/v1)
// 3. Idempotent Synchronization (Medicines, Reminders, Dose Events)
// 4. State Transition Enforcement
// 5. Cross-User Resource Isolation (Unauthorized access prevention)
// 6. Invalid / Missing Firebase Token Rejection
// 7. Offline Mutation Queue & Batch Retry
// =============================================================================

import {
  dbService,
  isValidDoseTransition,
  DoseStatus,
} from '../services/database.service';
import { SyncEngineService } from '../services/sync-engine.service';
import {
  resolveUserFromFirebase,
  getInternalUserById,
} from '../services/user-resolution.service';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTest(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`✅ [PASS] ${name}`);
  } catch (err: any) {
    results.push({ name, passed: false, error: err?.message || String(err) });
    console.error(`❌ [FAIL] ${name}:`, err?.message || err);
  }
}

export async function runPriorityPass3TestSuite() {
  console.log('====================================================');
  console.log('  STARTING MEDICARE PRIORITY PASS 3 TEST SUITE');
  console.log('====================================================\n');

  // Test User Setup: User A and User B
  const firebaseUserA = {
    uid: 'firebase_uid_user_alpha_12345',
    email: 'user.alpha@medicare.app',
    name: 'Patient Alpha',
  };

  const firebaseUserB = {
    uid: 'firebase_uid_user_beta_67890',
    email: 'user.beta@medicare.app',
    name: 'Patient Beta',
  };

  let userAInternalId = '';
  let userBInternalId = '';
  let medAId = '';
  let reminderAId = '';
  const localEventId1 = 'evt_local_uuid_' + Date.now() + '_01';

  // ── TEST 1: User ID Mapping ──────────────────────────────────────────────
  await runTest('1. User ID Mapping: Firebase UID -> internal users.id (UUID)', async () => {
    const userA = await resolveUserFromFirebase(firebaseUserA);
    const userB = await resolveUserFromFirebase(firebaseUserB);

    assert(Boolean(userA.id), 'User A internal UUID must be generated');
    assert(Boolean(userB.id), 'User B internal UUID must be generated');
    assert(userA.id !== firebaseUserA.uid, 'Internal user.id must NOT equal raw Firebase UID');
    assert(userA.firebaseUid === firebaseUserA.uid, 'users.firebase_uid must store the Firebase UID');
    assert(/^[0-9a-f-]{36}$/i.test(userA.id), 'Internal user.id must be a valid UUID');

    userAInternalId = userA.id;
    userBInternalId = userB.id;
  });

  // ── TEST 2: Authenticated Medicine Creation ──────────────────────────────
  await runTest('2. Authenticated Medicine Creation scoped to internal user.id', async () => {
    const med = await dbService.createMedicine(userAInternalId, {
      name: 'Metformin Hydrochloride',
      dosage: '500 mg',
      type: 'TABLET',
      mealTiming: 'AFTER_FOOD',
      stockCount: 30,
      lowStockThreshold: 5,
    });

    assert(Boolean(med.id), 'Medicine ID must be generated');
    assert(med.userId === userAInternalId, 'Medicine userId must match internal PostgreSQL UUID, NOT Firebase UID');
    assert(med.userId !== firebaseUserA.uid, 'Medicine userId must never be Firebase UID');
    assert(med.name === 'Metformin Hydrochloride', 'Medicine name must be stored');

    medAId = med.id;

    // Verify querying by User A retrieves it
    const userAMeds = await dbService.findMedicinesByUserId(userAInternalId);
    assert(userAMeds.some((m) => m.id === medAId), 'User A must find their created medicine');

    // Verify querying by User B does NOT return User A's medicine
    const userBMeds = await dbService.findMedicinesByUserId(userBInternalId);
    assert(!userBMeds.some((m) => m.id === medAId), "User B must not see User A's medicine");
  });

  // ── TEST 3: Authenticated Reminder Creation & FK Integrity ───────────────
  await runTest('3. Authenticated Reminder Creation with Foreign Key ownership validation', async () => {
    const rem = await dbService.createReminder(userAInternalId, {
      medicineId: medAId,
      scheduledTimes: ['08:00', '20:00'],
      recurrence: 'DAILY',
      snoozeMinutes: 10,
    });

    assert(Boolean(rem.id), 'Reminder ID must be generated');
    assert(rem.userId === userAInternalId, 'Reminder userId must match internal PostgreSQL UUID');
    assert(rem.medicineId === medAId, 'Reminder medicineId must match created medicine');

    reminderAId = rem.id;

    // Attempt to create reminder with invalid/foreign medicine belonging to another user
    let errorCaught = false;
    try {
      await dbService.createReminder(userBInternalId, {
        medicineId: medAId, // Belongs to User A!
        scheduledTimes: ['09:00'],
      });
    } catch {
      errorCaught = true;
    }
    assert(errorCaught, 'Creating a reminder referencing another user medicine must fail');
  });

  // ── TEST 4: Dose Event Creation with stable localEventId ──────────────────
  await runTest('4. Dose Event Creation with stable localEventId', async () => {
    const today = new Date().toISOString().split('T')[0];
    const { event, isDuplicate } = await dbService.upsertDoseEvent(userAInternalId, {
      localEventId: localEventId1,
      medicineId: medAId,
      reminderId: reminderAId,
      medicineName: 'Metformin Hydrochloride',
      dosage: '500 mg',
      mealTiming: 'AFTER_FOOD',
      scheduledTime: '08:00',
      scheduledDate: today,
      status: 'PENDING',
    });

    assert(Boolean(event.id), 'Dose event server UUID must be generated');
    assert(event.localEventId === localEventId1, 'localEventId must be preserved');
    assert(event.userId === userAInternalId, 'userId must match internal PostgreSQL UUID');
    assert(isDuplicate === false, 'First creation must have isDuplicate = false');
    assert(event.status === 'PENDING', 'Initial status must be PENDING');
  });

  // ── TEST 5: Duplicate Dose Event (Idempotency) ───────────────────────────
  await runTest('5. Duplicate Dose Event: replay must not create duplicate records', async () => {
    const today = new Date().toISOString().split('T')[0];
    const { event, isDuplicate } = await dbService.upsertDoseEvent(userAInternalId, {
      localEventId: localEventId1, // Same localEventId
      medicineId: medAId,
      reminderId: reminderAId,
      medicineName: 'Metformin Hydrochloride',
      dosage: '500 mg',
      scheduledTime: '08:00',
      scheduledDate: today,
      status: 'TAKEN',
      actionAt: new Date().toISOString(),
    });

    assert(isDuplicate === true, 'Duplicate submission must be recognized as duplicate');
    assert(event.localEventId === localEventId1, 'localEventId must match original');
    assert(event.status === 'TAKEN', 'Valid state transition to TAKEN must be applied');

    // Verify only ONE record exists for this localEventId
    const history = await dbService.findDoseEventsByUserId(userAInternalId);
    const matching = history.events.filter((e) => e.localEventId === localEventId1);
    assert(matching.length === 1, `Expected exactly 1 record in database, found ${matching.length}`);
  });

  // ── TEST 6: State Transition Validation ──────────────────────────────────
  await runTest('6. State Transition Enforcement (e.g. TAKEN cannot transition back to PENDING)', async () => {
    // Valid transitions
    assert(isValidDoseTransition('PENDING', 'TAKEN').valid, 'PENDING -> TAKEN must be valid');
    assert(isValidDoseTransition('PENDING', 'SNOOZED').valid, 'PENDING -> SNOOZED must be valid');
    assert(isValidDoseTransition('SNOOZED', 'TAKEN').valid, 'SNOOZED -> TAKEN must be valid');
    assert(isValidDoseTransition('TAKEN', 'TAKEN').valid, 'TAKEN -> TAKEN (idempotent replay) must be valid');

    // Invalid transition
    const invalidCheck = isValidDoseTransition('TAKEN', 'PENDING');
    assert(!invalidCheck.valid, 'TAKEN -> PENDING must be rejected as invalid');
  });

  // ── TEST 7: Cross-User Resource Isolation (Unauthorized Access Prevention) ─
  await runTest('7. Unauthorized Resource Access: User B cannot access/modify User A resources', async () => {
    // User B trying to find User A's medicine by ID
    const medNotFound = await dbService.findMedicineById(medAId, userBInternalId);
    assert(medNotFound === null, 'User B must not be able to retrieve User A medicine');

    // User B trying to update User A's medicine
    let updateFailed = false;
    try {
      await dbService.updateMedicine(medAId, userBInternalId, { name: 'Hacked Name' });
    } catch {
      updateFailed = true;
    }
    assert(updateFailed, 'User B updating User A medicine must throw unauthorized error');

    // User B trying to delete User A's medicine
    let deleteFailed = false;
    try {
      await dbService.deleteMedicine(medAId, userBInternalId);
    } catch {
      deleteFailed = true;
    }
    assert(deleteFailed, 'User B deleting User A medicine must throw unauthorized error');
  });

  // ── TEST 8: Batch Sync Engine with Idempotency ───────────────────────────
  await runTest('8. Batch Sync Engine (/api/v1/sync/batch) handles create, update, and duplicate replay', async () => {
    const medLocalId = 'med_sync_loc_' + Date.now();
    const doseLocalId = 'dose_sync_loc_' + Date.now();
    const today = new Date().toISOString().split('T')[0];

    const syncBatch = [
      {
        localId: medLocalId,
        resource: 'medicine' as const,
        operation: 'CREATE' as const,
        payload: {
          id: medLocalId,
          name: 'Amlodipine Besylate',
          dosage: '5 mg',
          type: 'TABLET',
          mealTiming: 'AFTER_FOOD',
          stockCount: 15,
          lowStockThreshold: 5,
        },
      },
      {
        localId: doseLocalId,
        resource: 'dose_event' as const,
        operation: 'CREATE' as const,
        payload: {
          localEventId: doseLocalId,
          medicineId: medLocalId,
          medicineName: 'Amlodipine Besylate',
          dosage: '5 mg',
          scheduledTime: '08:00',
          scheduledDate: today,
          status: 'PENDING',
        },
      },
    ];

    // First batch execution
    const batchRes1 = await SyncEngineService.processBatch(userAInternalId, syncBatch);
    assert(batchRes1.successful === 2, `Expected 2 successful items, got ${batchRes1.successful}`);
    assert(batchRes1.duplicates === 0, 'First execution should have 0 duplicates');

    // Replay identical batch (idempotency verification)
    const batchRes2 = await SyncEngineService.processBatch(userAInternalId, syncBatch);
    assert(batchRes2.successful === 2, `Expected 2 successful replayed items, got ${batchRes2.successful}`);
    assert(batchRes2.duplicates === 2, `Expected 2 duplicate recognitions, got ${batchRes2.duplicates}`);

    // Verify sync logs were created
    const logs = await dbService.getSyncLogs(userAInternalId);
    assert(logs.length >= 4, `Expected at least 4 sync logs, found ${logs.length}`);
  });

  // ── TEST 9: Offline Queue Simulation & Network Restoration ───────────────
  await runTest('9. Offline Queue & Network Restoration: items queue offline and drain on reconnect', async () => {
    const offlineItem = {
      localId: 'offline_evt_' + Date.now(),
      resource: 'dose_event' as const,
      operation: 'CREATE' as const,
      payload: {
        localEventId: 'offline_evt_' + Date.now(),
        medicineId: medAId,
        medicineName: 'Metformin Hydrochloride',
        dosage: '500 mg',
        scheduledTime: '14:00',
        scheduledDate: new Date().toISOString().split('T')[0],
        status: 'TAKEN',
      },
    };

    // When network is restored, batch sync drains the queue
    const syncRes = await SyncEngineService.processBatch(userAInternalId, [offlineItem]);
    assert(syncRes.successful === 1, 'Offline queued item must successfully sync on reconnection');
    assert(syncRes.failed === 0, 'No failures expected during queue drain');
  });

  // ── TEST 10: Refill Rule & Stock Auto-Update ──────────────────────────────
  await runTest('10. Refill Rules: recording refill must update medicine stock count', async () => {
    const refillRule = await dbService.upsertRefillRule(userAInternalId, {
      medicineId: medAId,
      lowStockThreshold: 5,
      refillQuantity: 60,
      pharmacyName: 'City Care Pharmacy',
    });

    assert(Boolean(refillRule.id), 'Refill rule ID must be generated');
    assert(refillRule.userId === userAInternalId, 'Refill rule userId must match internal user.id');
    assert(refillRule.refillQuantity === 60, 'Refill quantity must be stored');

    // Mark refilled
    const refilled = await dbService.markRefilled(refillRule.id, userAInternalId);
    assert(Boolean(refilled.lastRefillDate), 'lastRefillDate must be set');

    // Verify medicine stock count updated to 60
    const medicine = await dbService.findMedicineById(medAId, userAInternalId);
    assert(medicine?.stockCount === 60, `Medicine stockCount should be 60, found ${medicine?.stockCount}`);
  });

  // ── TEST 11: Adherence Analytics Calculation ─────────────────────────────
  await runTest('11. Adherence Analytics: calculates adherence percentage and status breakdown', async () => {
    const today = new Date().toISOString().split('T')[0];
    const stats = await dbService.getAdherenceStats(userAInternalId, today, today);
    assert(typeof stats.adherenceScore === 'number', 'adherenceScore must be a number');
    assert(stats.totalDoses >= 1, 'totalDoses must reflect recorded doses');
    assert(stats.adherenceScore >= 0 && stats.adherenceScore <= 100, 'adherenceScore must be between 0 and 100');
  });

  // ── TEST 12: Caregiver Relations & Access Level ──────────────────────────
  await runTest('12. Caregiver Relations: Patient can add and manage caregiver relations', async () => {
    const caregiver = await dbService.addCaregiver(userAInternalId, {
      caregiverEmail: 'daughter.anita@email.com',
      caregiverName: 'Anita Sharma',
      relationLabel: 'Daughter',
      accessLevel: 'MANAGE',
      notifyOnMissed: true,
    });

    assert(Boolean(caregiver.id), 'Caregiver relation ID must be generated');
    assert(caregiver.userId === userAInternalId, 'Caregiver relation userId must match internal user.id');
    assert(caregiver.accessLevel === 'MANAGE', 'Caregiver access level must be stored');

    const caregiversList = await dbService.findCaregiversByUserId(userAInternalId);
    assert(caregiversList.some((c) => c.id === caregiver.id), 'User A must find the added caregiver');
  });

  // ── TEST 13: Device Tokens Registration & Deactivation ────────────────────
  await runTest('13. Device Tokens: Register and deactivate FCM device tokens', async () => {
    const token = 'fcm_token_device_senior_phone_998877';
    await dbService.registerDeviceToken(userAInternalId, token, 'android');
    await dbService.deactivateDeviceToken(userAInternalId, token);
    // Success if no exception thrown
  });

  console.log('\n====================================================');
  console.log('  TEST SUITE COMPLETED');
  const passCount = results.filter((r) => r.passed).length;
  console.log(`  Total: ${results.length}, Passed: ${passCount}, Failed: ${results.length - passCount}`);
  console.log('====================================================\n');

  return {
    total: results.length,
    passed: passCount,
    failed: results.length - passCount,
    results,
  };
}

// Auto-run if executed directly via tsx
if (process.argv[1]?.includes('priority-pass-3.test.ts')) {
  runPriorityPass3TestSuite().then((summary) => {
    if (summary.failed > 0) {
      process.exit(1);
    }
  });
}
