import { DoseEvent, UserProfile, Medicine } from '../types';
import {
  getAllDoses,
  recordDoseAction,
  getMedicines,
  getUserProfile,
  syncDosesWithMedicines,
} from '../utils/storage';

export type AlarmCallback = (dose: DoseEvent) => void;

class ReminderService {
  private intervalId: any = null;
  private onAlarmCallback: AlarmCallback | null = null;
  // Keep track of dose IDs and timestamps triggered in the current session to avoid duplicate spamming
  private triggeredDoseTimestamps: Map<string, number> = new Map();

  /**
   * Convert a time string (e.g. "08:00 AM", "02:30 PM", "14:00") into minutes from midnight
   */
  public parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const clean = timeStr.trim();
    const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return 0;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridian = match[3]?.toUpperCase();

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  /**
   * Check if a dose is due right now
   */
  public isDoseDue(dose: DoseEvent, now: Date): boolean {
    const todayStr = now.toISOString().split('T')[0];

    // Must be for today or an earlier unhandled date
    if (dose.scheduledDate !== todayStr) {
      return false;
    }

    // 1. Snoozed dose: check if snooze time has expired
    if (dose.status === 'snoozed' && dose.snoozeUntil) {
      const snoozeTime = new Date(dose.snoozeUntil).getTime();
      return now.getTime() >= snoozeTime;
    }

    // 2. Pending dose: check if scheduled time has arrived
    if (dose.status === 'pending') {
      const scheduledMinutes = this.parseTimeToMinutes(dose.scheduledTime);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Due if current time is at or within 30 minutes after scheduled time
      const diff = currentMinutes - scheduledMinutes;
      return diff >= 0 && diff <= 30;
    }

    return false;
  }

  /**
   * Run a single tick check on all active doses
   */
  public checkDoses(callback?: AlarmCallback): DoseEvent | null {
    const now = new Date();
    const allDoses = getAllDoses();
    const todayStr = now.toISOString().split('T')[0];
    const todayDoses = allDoses.filter((d) => d.scheduledDate === todayStr);

    for (const dose of todayDoses) {
      if (this.isDoseDue(dose, now)) {
        const lastTriggered = this.triggeredDoseTimestamps.get(dose.id) || 0;
        const timeSinceLastTrigger = now.getTime() - lastTriggered;

        // Prevent re-triggering the same dose within 60 seconds unless explicitly re-snoozed
        if (timeSinceLastTrigger > 60000) {
          this.triggeredDoseTimestamps.set(dose.id, now.getTime());
          const targetCb = callback || this.onAlarmCallback;
          if (targetCb) {
            targetCb(dose);
          }
          return dose;
        }
      }
    }

    return null;
  }

  /**
   * Start the reminder listener loop
   */
  public start(onAlarm: AlarmCallback) {
    this.onAlarmCallback = onAlarm;

    // Perform initial check on mount/start
    this.checkDoses(onAlarm);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Check every 4 seconds
    this.intervalId = setInterval(() => {
      this.checkDoses(onAlarm);
    }, 4000);

    // Also check immediately when tab gains focus / visibility
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.handleVisibilityChange);
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && this.onAlarmCallback) {
      this.checkDoses(this.onAlarmCallback);
    }
  };

  /**
   * Stop the reminder listener loop
   */
  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.onAlarmCallback = null;
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', this.handleVisibilityChange);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  /**
   * User marks dose as taken
   */
  public takeDose(doseId: string, actualTime?: string): { doses: DoseEvent[]; updatedDose?: DoseEvent } {
    this.triggeredDoseTimestamps.delete(doseId);
    return recordDoseAction(doseId, 'taken', { actualTime });
  }

  /**
   * User snoozes dose for a given number of minutes
   */
  public snoozeDose(doseId: string, minutes: number = 10): { doses: DoseEvent[]; updatedDose?: DoseEvent } {
    // Reset trigger cache so it can fire when snooze period ends
    this.triggeredDoseTimestamps.delete(doseId);
    return recordDoseAction(doseId, 'snoozed', { snoozeMinutes: minutes });
  }

  /**
   * User skips dose
   */
  public skipDose(doseId: string): { doses: DoseEvent[]; updatedDose?: DoseEvent } {
    this.triggeredDoseTimestamps.delete(doseId);
    return recordDoseAction(doseId, 'skipped');
  }

  /**
   * Manually trigger alarm for a dose (e.g. Test Alarm or User Tap)
   */
  public triggerManualAlarm(dose: DoseEvent) {
    if (this.onAlarmCallback) {
      this.onAlarmCallback(dose);
    }
  }

  /**
   * Clear all trigger tracking
   */
  public resetTriggers() {
    this.triggeredDoseTimestamps.clear();
  }
}

export const reminderService = new ReminderService();
