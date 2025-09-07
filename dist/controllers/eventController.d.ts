import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
export declare class EventController {
    static getAllEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static getEventsByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=eventController.d.ts.map