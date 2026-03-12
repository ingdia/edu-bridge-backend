/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export declare const hashPassword: (password: string) => Promise<string>;
/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match
 */
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
//# sourceMappingURL=password.d.ts.map