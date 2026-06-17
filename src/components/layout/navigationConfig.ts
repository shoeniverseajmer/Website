import { Boxes, ChartNoAxesCombined, Home, Heart, ListTree, PackageCheck, Search, Settings, ShoppingBag, Sparkles, Store, Tag, User } from 'lucide-react';

export const userNavLinks = [
  { to: '/shop?gender_category=men', label: 'MEN', icon: Store },
  { to: '/shop?gender_category=women', label: 'WOMEN', icon: Sparkles },
  { to: '/shop?gender_category=kids', label: 'KIDS', icon: Sparkles },
  { to: '/shop', label: 'SNEAKERS', icon: Search },
  { to: '/shop?product_type=accessories', label: 'ACCESSORIES', icon: ShoppingBag },
  { to: '/shop?sale=true', label: 'SALE', icon: Tag },
  { to: '/orders', label: 'TRACK ORDER', icon: PackageCheck }
];

export const mobilePrimaryLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: Search },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingBag },
  { to: '/account', label: 'Account', icon: User }
];

export const adminNavLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: ChartNoAxesCombined },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/categories', label: 'Categories', icon: ListTree },
  { to: '/admin/orders', label: 'Orders', icon: PackageCheck },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];
