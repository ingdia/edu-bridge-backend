import { Request, Response } from 'express';
export declare class NotificationController {
    createNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createBulkNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyNotifications(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUnreadCount(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAllAsRead(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateNotificationStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const notificationController: NotificationController;
//# sourceMappingURL=notification.controller.d.ts.map