import { Request, Response, NextFunction } from 'express';
export declare const sendMessageController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getInboxController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSentController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getConversationController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsReadController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUnreadCountController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteMessageController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getConversationsListController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=message.controller.d.ts.map