import { Router } from 'express';
import { categoriesIndex, productsIndex, productsShow } from '../controllers/productController';
import { validate } from '../middleware/validate';
import { slugParamSchema } from '../validations/commonSchemas';
import { productListQuerySchema } from '../validations/productSchemas';

export const productRoutes = Router();

productRoutes.get('/products', validate(productListQuerySchema, 'query'), productsIndex);
productRoutes.get('/products/:slug', validate(slugParamSchema, 'params'), productsShow);
productRoutes.get('/categories', categoriesIndex);
