import type { ErrorRequestHandler } from 'express';
import { ApiError } from '../utils/apiError';

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error(error);
  const status = error instanceof ApiError ? error.status : error.status ?? 500;
  response.status(status).json({
    message: error.message ?? 'Unexpected server error',
    details: error instanceof ApiError ? error.details : undefined
  });
};
