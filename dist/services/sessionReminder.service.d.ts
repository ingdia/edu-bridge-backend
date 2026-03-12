/**
 * Automated Session Reminder Service (FR 7.2 + FR 9)
 *
 * This service sends automatic reminders for upcoming mentorship sessions.
 * Should be run as a scheduled job (cron) - e.g., every hour or twice daily.
 */
export declare class SessionReminderService {
    /**
     * Send reminders for sessions happening in the next 24 hours
     * that haven't been reminded yet
     */
    static sendUpcomingSessionReminders(): Promise<{
        success: boolean;
        message: string;
        remindersSent: number;
    } | {
        success: boolean;
        message: string;
        remindersSent?: undefined;
    }>;
    /**
     * Send reminders for sessions happening in 1 hour (last-minute reminder)
     */
    static sendImmediateSessionReminders(): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Mark sessions as NO_SHOW if they're past scheduled time and still SCHEDULED
     */
    static markMissedSessions(): Promise<{
        success: boolean;
        message: string;
        count: number;
    } | {
        success: boolean;
        message: string;
        count?: undefined;
    }>;
}
/**
 * Example usage in a cron job or scheduled task:
 *
 * // Run every hour
 * cron.schedule('0 * * * *', async () => {
 *   await SessionReminderService.sendUpcomingSessionReminders();
 *   await SessionReminderService.sendImmediateSessionReminders();
 * });
 *
 * // Run daily at midnight to clean up missed sessions
 * cron.schedule('0 0 * * *', async () => {
 *   await SessionReminderService.markMissedSessions();
 * });
 */
//# sourceMappingURL=sessionReminder.service.d.ts.map