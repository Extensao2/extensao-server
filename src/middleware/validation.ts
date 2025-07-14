import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from './errorHandler';

export const validateBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      next(new AppError(messages, 400));
      return;
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      next(new AppError(messages, 400));
      return;
    }

    req.query = value;
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      next(new AppError(messages, 400));
      return;
    }

    req.params = value;
    next();
  };
};