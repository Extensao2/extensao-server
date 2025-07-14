import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '@/types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados de entrada inválidos';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  } else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Recurso já existe';
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const errorResponse: ErrorResponse = {
    error: error.name || 'ServerError',
    message,
    statusCode
  };

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Rota não encontrada: ${req.originalUrl}`, 404);
  next(error);
};