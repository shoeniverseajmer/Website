export type UserRole = 'customer' | 'admin' | 'operator';
export type GenderCategory = 'men' | 'women' | 'kids' | 'unisex';
export type ProductType = 'shoes' | 'accessories';
export type AccessoryType = 'belts' | 'wallets' | 'bags' | null;
export type Occasion = 'casual' | 'festive' | 'formal' | 'sports';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'razorpay' | 'upi';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'shipped' | 'ready_for_pickup' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  stock: number;
  gender_category: GenderCategory;
  product_type: ProductType;
  accessory_type: AccessoryType;
  occasion: Occasion;
  is_bestseller: boolean;
  is_on_sale: boolean;
  is_active: boolean;
  created_at: string;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  order_type: OrderType;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  address_id: string | null;
  created_at: string;
  order_items?: OrderItem[];
  addresses?: Address;
}

export interface StoreSettings {
  id: string;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
  cod_enabled: boolean;
  delivery_charge: number;
  pickup_address: string;
}

export interface ProductFilters {
  search?: string;
  gender_category?: GenderCategory;
  product_type?: ProductType;
  accessory_type?: Exclude<AccessoryType, null>;
  occasion?: Occasion;
  sale?: boolean;
  bestseller?: boolean;
}
