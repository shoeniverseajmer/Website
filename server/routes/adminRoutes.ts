import { Router } from 'express';
import {
  adminCategoriesIndex,
  adminCategoriesCreate,
  adminCategoriesDelete,
  adminOrdersIndex,
  adminOrdersUpdate,
  adminProductsDelete,
  adminProductsIndex,
  adminProductsUpsert,
  adminUploadImages,
  settingsShow,
  settingsUpdate
} from '../controllers/adminController';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema } from '../validations/commonSchemas';
import { categoryCreateSchema, imageUploadSchema, productUpsertSchema } from '../validations/productSchemas';
import { updateOrderStatusSchema } from '../validations/orderSchemas';
import { settingsUpdateSchema } from '../validations/settingsSchemas';

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);
adminRoutes.get('/admin/products', adminProductsIndex);
adminRoutes.post('/admin/products', validate(productUpsertSchema), adminProductsUpsert);
adminRoutes.post('/admin/uploads', validate(imageUploadSchema), adminUploadImages);
adminRoutes.delete('/admin/products/:id', validate(idParamSchema, 'params'), adminProductsDelete);
adminRoutes.get('/admin/categories', adminCategoriesIndex);
adminRoutes.post('/admin/categories', validate(categoryCreateSchema), adminCategoriesCreate);
adminRoutes.delete('/admin/categories/:id', validate(idParamSchema, 'params'), adminCategoriesDelete);
adminRoutes.get('/admin/orders', adminOrdersIndex);
adminRoutes.patch('/admin/orders/:id', validate(idParamSchema, 'params'), validate(updateOrderStatusSchema), adminOrdersUpdate);
adminRoutes.get('/admin/settings', settingsShow);
adminRoutes.patch('/admin/settings', validate(settingsUpdateSchema), settingsUpdate);
