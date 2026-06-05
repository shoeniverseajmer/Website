import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/apiError';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request[part]);
    if (!result.success) {
      next(
        new ApiError(
          400,
          'Validation failed',
          result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        )
      );
      return;
    }

    request[part] = result.data;
    next();
  };
}
