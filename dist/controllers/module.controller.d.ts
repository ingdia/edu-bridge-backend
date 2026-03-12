import type { Request, Response } from 'express';
export declare const createModuleHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getModuleHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const listModulesHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateModuleHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteModuleHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const toggleModuleStatusHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getModulesForMentorHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getModulesForStudentHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=module.controller.d.ts.map