import type { Request, Response } from 'express';
import { createCategory, adminProducts, deleteCategory, deleteProduct, getSettings, saveSettings, upsertProduct } from '../services/adminService';
import { listCategories } from '../services/productService';
import { listOrders, updateOrderStatus } from '../services/orderService';
import { asyncHandler } from '../utils/asyncHandler';
import { created, noContent, ok } from '../utils/apiResponse';

export const adminProductsIndex = asyncHandler(async (_request: Request, response: Response) => {
  ok(response, await adminProducts());
});

export const adminProductsUpsert = asyncHandler(async (request: Request, response: Response) => {
  ok(response, await upsertProduct(request.body));
});

export const adminProductsDelete = asyncHandler(async (request: Request, response: Response) => {
  await deleteProduct(request.params.id);
  noContent(response);
});

export const adminCategoriesIndex = asyncHandler(async (_request: Request, response: Response) => {
  ok(response, await listCategories());
});

export const adminCategoriesCreate = asyncHandler(async (request: Request, response: Response) => {
  created(response, await createCategory(request.body));
});

export const adminCategoriesDelete = asyncHandler(async (request: Request, response: Response) => {
  await deleteCategory(request.params.id);
  noContent(response);
});

export const adminOrdersIndex = asyncHandler(async (_request: Request, response: Response) => {
  ok(response, await listOrders());
});

export const adminOrdersUpdate = asyncHandler(async (request: Request, response: Response) => {
  ok(response, await updateOrderStatus(request.params.id, request.body.order_status));
});

export const settingsShow = asyncHandler(async (_request: Request, response: Response) => {
  ok(response, await getSettings());
});

export const settingsUpdate = asyncHandler(async (request: Request, response: Response) => {
  ok(response, await saveSettings(request.body));
});
