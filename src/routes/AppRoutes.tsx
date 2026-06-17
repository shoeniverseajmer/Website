import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '../components/ui/Skeleton';

const lazyPage = <T extends ComponentType<any>>(loader: () => Promise<{ [key: string]: T }>, exportName: string) =>
  lazy(async () => {
    const module = await loader();
    return { default: module[exportName] };
  });

const HomePage = lazyPage(() => import('../pages/HomePage'), 'HomePage');
const ShopPage = lazyPage(() => import('../pages/ShopPage'), 'ShopPage');
const ProductDetailPage = lazyPage(() => import('../pages/ProductDetailPage'), 'ProductDetailPage');
const CartPage = lazyPage(() => import('../pages/CartPage'), 'CartPage');
const WishlistPage = lazyPage(() => import('../pages/WishlistPage'), 'WishlistPage');
const CheckoutPage = lazyPage(() => import('../pages/CheckoutPage'), 'CheckoutPage');
const OrdersPage = lazyPage(() => import('../pages/OrdersPage'), 'OrdersPage');
const LoginPage = lazyPage(() => import('../pages/auth/LoginPage'), 'LoginPage');
const SignupPage = lazyPage(() => import('../pages/auth/SignupPage'), 'SignupPage');
const AuthCallbackPage = lazyPage(() => import('../pages/auth/AuthCallbackPage'), 'AuthCallbackPage');
const AccountPage = lazyPage(() => import('../pages/AccountPage'), 'AccountPage');
const AdminDashboardPage = lazyPage(() => import('../pages/admin/AdminDashboardPage'), 'AdminDashboardPage');
const AdminProductsPage = lazyPage(() => import('../pages/admin/AdminProductsPage'), 'AdminProductsPage');
const AdminProductFormPage = lazyPage(() => import('../pages/admin/AdminProductFormPage'), 'AdminProductFormPage');
const AdminCategoriesPage = lazyPage(() => import('../pages/admin/AdminCategoriesPage'), 'AdminCategoriesPage');
const AdminOrdersPage = lazyPage(() => import('../pages/admin/AdminOrdersPage'), 'AdminOrdersPage');
const AdminSettingsPage = lazyPage(() => import('../pages/admin/AdminSettingsPage'), 'AdminSettingsPage');

function RouteLoader() {
  return (
    <div className="container-shell grid gap-5 py-10 md:grid-cols-3">
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
    </div>
  );
}

const suspense = (node: ReactNode) => <Suspense fallback={<RouteLoader />}>{node}</Suspense>;

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: suspense(<HomePage />) },
      { path: '/shop', element: suspense(<ShopPage />) },
      { path: '/product/:slug', element: suspense(<ProductDetailPage />) },
      { path: '/cart', element: suspense(<CartPage />) },
      { path: '/wishlist', element: suspense(<WishlistPage />) },
      { path: '/checkout', element: suspense(<CheckoutPage />) },
      { path: '/orders', element: suspense(<OrdersPage />) },
      { path: '/login', element: suspense(<LoginPage />) },
      { path: '/signup', element: suspense(<SignupPage />) },
      { path: '/account', element: suspense(<AccountPage />) },
      { path: '/auth/callback', element: suspense(<AuthCallbackPage />) }
    ]
  },
  { path: '/admin/login', element: suspense(<LoginPage admin />) },
  {
    element: <ProtectedRoute admin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin/dashboard', element: suspense(<AdminDashboardPage />) },
          { path: '/admin/products', element: suspense(<AdminProductsPage />) },
          { path: '/admin/products/new', element: suspense(<AdminProductFormPage />) },
          { path: '/admin/products/edit/:id', element: suspense(<AdminProductFormPage />) },
          { path: '/admin/categories', element: suspense(<AdminCategoriesPage />) },
          { path: '/admin/orders', element: suspense(<AdminOrdersPage />) },
          { path: '/admin/settings', element: suspense(<AdminSettingsPage />) }
        ]
      }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);
