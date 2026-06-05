import { mockCategories, mockOrders, mockProducts, mockSettings } from '../../src/lib/mockData';

export const mockDb = {
  products: [...mockProducts],
  categories: [...mockCategories],
  orders: [...mockOrders],
  settings: { ...mockSettings }
};
