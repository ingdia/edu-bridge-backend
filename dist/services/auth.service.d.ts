import { type Role } from '../utils/jwt';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';
export interface RegisterOutput {
    user: {
        id: string;
        email: string;
        role: Role;
    };
    accessToken: string;
    refreshToken: string;
}
export declare const registerUser: (data: RegisterInput, ipAddress?: string) => Promise<RegisterOutput>;
export interface LoginOutput {
    user: {
        id: string;
        email: string;
        role: Role;
        fullName?: string;
    };
    accessToken: string;
    refreshToken: string;
}
export declare const loginUser: (data: LoginInput, ipAddress?: string) => Promise<LoginOutput>;
export declare const logoutUser: (userId: string, token: string, ipAddress?: string) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map