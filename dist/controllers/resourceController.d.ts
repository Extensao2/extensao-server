import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
export declare class ResourceController {
    static createResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static getResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static updateResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static deleteResource(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    static searchResources(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=resourceController.d.ts.map