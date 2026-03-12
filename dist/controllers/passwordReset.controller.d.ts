import type { Request, Response } from 'express';
export declare const requestPasswordResetController: (req: Request, res: Response) => Promise<void>;
export declare const resetPasswordController: (req: Request, res: Response) => Promise<void>;
export declare const verifyResetTokenController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=passwordReset.controller.d.ts.map