import { Role as PrismaRole } from '@prisma/client';
export type Role = PrismaRole;
export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
}
export declare const generateAccessToken: (payload: JWTPayload) => string;
export declare const generateRefreshToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.d.ts.map