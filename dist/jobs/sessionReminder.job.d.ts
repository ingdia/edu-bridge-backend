/**
 * Send reminders for sessions scheduled in the next 24 hours
 * Runs daily at 9:00 AM
 */
export declare const startSessionReminderJob: () => void;
/**
 * Send deadline alerts for applications due in the next 3 days
 * Runs daily at 10:00 AM
 */
export declare const startDeadlineAlertJob: () => void;
/**
 * Start all cron jobs
 */
export declare const startAllCronJobs: () => void;
//# sourceMappingURL=sessionReminder.job.d.ts.map