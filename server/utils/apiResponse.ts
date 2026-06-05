import type { Response } from 'express';

export function ok<T>(response: Response, data: T, status = 200) {
  response.status(status).json(data);
}

export function created<T>(response: Response, data: T) {
  ok(response, data, 201);
}

export function noContent(response: Response) {
  response.status(204).send();
}
