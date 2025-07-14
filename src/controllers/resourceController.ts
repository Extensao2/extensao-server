import { Response, NextFunction } from 'express';
import { ResourceModel } from '@/models/Resource';
import { AuthenticatedRequest, PaginatedResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class ResourceController {
  static async createResource(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, content } = req.body;
      const userId = req.user!.id;

      const resource = new ResourceModel({
        title,
        content,
        createdBy: userId
      });

      await resource.save();

      res.status(201).json({
        id: resource.id
      });
    } catch (error) {
      next(error);
    }
  }

  static async getResource(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resource_id } = req.params;

      const resource = await ResourceModel.findById(resource_id);

      if (!resource) {
        next(new AppError('Recurso não encontrado', 404));
        return;
      }

      res.status(200).json({
        id: resource.id,
        title: resource.title,
        content: resource.content
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateResource(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resource_id } = req.params;
      const updates = req.body;

      const resource = await ResourceModel.findById(resource_id);

      if (!resource) {
        next(new AppError('Recurso não encontrado', 404));
        return;
      }

      Object.assign(resource, updates);
      await resource.save();

      res.status(200).json({
        id: resource.id
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteResource(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { resource_id } = req.params;

      const resource = await ResourceModel.findById(resource_id);

      if (!resource) {
        next(new AppError('Recurso não encontrado', 404));
        return;
      }

      await ResourceModel.findByIdAndDelete(resource_id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async searchResources(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, page = 0, size = 10 } = req.query as any;

      const filter: any = {};
      if (title) {
        filter.$text = { $search: title };
      }

      const skip = page * size;
      const limit = size;

      const [resources, totalItems] = await Promise.all([
        ResourceModel
          .find(filter, { title: 1 })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ResourceModel.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalItems / size);

      const response: PaginatedResponse<any> = {
        items: resources.map(resource => ({
          id: resource._id,
          title: resource.title
        })),
        page,
        size,
        totalItems,
        totalPages
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}