import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  <TRequest extends Request = Request>(handler: (request: TRequest, response: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (request, response, next) => {
    Promise.resolve(handler(request as TRequest, response, next)).catch(next);
  };
