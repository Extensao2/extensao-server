import { Response, NextFunction } from 'express';
import { EventModel } from '@/models/Event';
import { AuthenticatedRequest } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class EventController {
  static async getAllEvents(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const events = await EventModel
        .find()
        .sort({ data: -1 })
        .lean();

      const formattedEvents = events.map(event => ({
        id: event._id,
        nome: event.nome,
        data: event.data.toISOString(),
        descricao: event.descricao
      }));

      res.status(200).json(formattedEvents);
    } catch (error) {
      next(error);
    }
  }

  static async getEventsByUserId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user_id } = req.params;

      const events = await EventModel
        .find({ userId: user_id })
        .sort({ data: -1 })
        .lean();

      if (events.length === 0) {
        next(new AppError('Nenhum evento encontrado para este usuário', 404));
        return;
      }

      const formattedEvents = events.map(event => ({
        id: event._id,
        nome: event.nome,
        data: event.data.toISOString(),
        descricao: event.descricao
      }));

      res.status(200).json(formattedEvents);
    } catch (error) {
      next(error);
    }
  }
}