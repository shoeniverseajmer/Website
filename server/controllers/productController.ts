import type { Request, Response } from 'express';
import { getProductBySlug, listCategories, listProducts } from '../services/productService';
import { asyncHandler } from '../utils/asyncHandler';
import { notFound } from '../utils/apiError';
import { ok } from '../utils/apiResponse';

export const productsIndex = asyncHandler(async (request: Request, response: Response) => {
  ok(response, await listProducts(request.query));
});

export const productsShow = asyncHandler(async (request: Request, response: Response) => {
  const product = await getProductBySlug(request.params.slug);
  if (!product) throw notFound('Product not found');
  ok(response, product);
});

export const categoriesIndex = asyncHandler(async (_request: Request, response: Response) => {
  ok(response, await listCategories());
});
