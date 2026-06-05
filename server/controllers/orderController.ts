import type { Response } from 'express';
import type { AuthedRequest } from '../middleware/auth';
import { createOrder, listOrders } from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import { created, ok } from '../utils/apiResponse';

export const ordersIndex = asyncHandler<AuthedRequest>(async (request, response: Response) => {
  ok(response, await listOrders(request.user?.id));
});

export const ordersCreate = asyncHandler<AuthedRequest>(async (request, response: Response) => {
  created(response, await createOrder(request.user, request.body));
});
