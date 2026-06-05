import { Router } from 'express';
import { ordersCreate, ordersIndex } from '../controllers/orderController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '../validations/orderSchemas';

export const orderRoutes = Router();

orderRoutes.get('/orders', requireAuth, ordersIndex);
orderRoutes.post('/orders', requireAuth, validate(createOrderSchema), ordersCreate);
