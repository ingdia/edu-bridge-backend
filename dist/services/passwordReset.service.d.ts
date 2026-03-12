export declare const requestPasswordReset: (email: string) => Promise<void>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<void>;
export declare const verifyResetToken: (token: string) => Promise<boolean>;
//# sourceMappingURL=passwordReset.service.d.ts.map