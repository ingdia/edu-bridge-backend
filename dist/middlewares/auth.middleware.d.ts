import { Request, Response, NextFunction } from 'express';
import { type Role } from '../utils/jwt';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: Role;
            };
        }
    }
}
/**
 * Middleware to verify JWT Access Token (SRS NFR 1: Security)
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to check user role (SRS NFR 10: Privacy & Access Control)
 * @param allowedRoles - Array of roles allowed to access the route
 */
export declare const authorize: (...allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map