create extension if not exists "uuid-ossp";

create type user_role as enum ('customer', 'admin', 'operator');
create type gender_category as enum ('men', 'women', 'kids', 'unisex');
create type product_type as enum ('shoes', 'accessories');
create type accessory_type as enum ('belts', 'wallets', 'bags');
create type occasion_type as enum ('casual', 'festive', 'formal', 'sports');
create type order_type as enum ('delivery', 'pickup');
create type payment_method as enum ('cod', 'razorpay', 'upi');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type order_status as enum ('placed', 'confirmed', 'packed', 'shipped', 'ready_for_pickup', 'delivered', 'cancelled');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  gender_category gender_category not null,
  product_type product_type not null,
  accessory_type accessory_type,
  occasion occasion_type not null default 'casual',
  is_bestseller boolean not null default false,
  is_on_sale boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text not null,
  stock integer not null default 0 check (stock >= 0)
);

create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null
);

create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

create table public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unique (user_id, product_id)
);

create table public.wishlist_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  unique (user_id, product_id)
);

create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null
);

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  order_type order_type not null,
  payment_method payment_method not null,
  payment_status payment_status not null default 'pending',
  order_status order_status not null default 'placed',
  address_id uuid references public.addresses(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price numeric(12, 2) not null check (price >= 0)
);

create table public.store_settings (
  id uuid primary key default uuid_generate_v4(),
  delivery_enabled boolean not null default true,
  pickup_enabled boolean not null default true,
  cod_enabled boolean not null default true,
  delivery_charge numeric(12, 2) not null default 0,
  pickup_address text not null default ''
);

insert into public.store_settings (delivery_enabled, pickup_enabled, cod_enabled, delivery_charge, pickup_address)
values (true, true, true, 99, 'SoleLux Studio, MG Road, Bengaluru, Karnataka');

insert into public.categories (name, slug)
values ('Men', 'men'), ('Women', 'women'), ('Kids', 'kids'), ('Accessories', 'accessories')
on conflict (slug) do nothing;

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.categories enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

create policy "Public active products" on public.products for select using (is_active = true);
create policy "Public product images" on public.product_images for select using (true);
create policy "Public product variants" on public.product_variants for select using (true);
create policy "Public categories" on public.categories for select using (true);
create policy "Public settings" on public.store_settings for select using (true);

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users manage own cart" on public.cart_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users read own order items" on public.order_items for select using (
  exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Customer'),
    coalesce(new.email, ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Create a public Supabase Storage bucket named "product-images" in the dashboard.
-- Store image URLs in product_images.image_url after upload.
