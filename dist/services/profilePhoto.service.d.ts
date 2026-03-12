import type { Role } from '../utils/jwt';
export declare const uploadProfilePhoto: (userId: string, role: Role, file: Express.Multer.File) => Promise<string>;
export declare const deleteProfilePhoto: (userId: string, role: Role) => Promise<void>;
//# sourceMappingURL=profilePhoto.service.d.ts.map