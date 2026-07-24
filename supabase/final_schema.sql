-- ============================================
-- MS Computer — Complete Schema
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- 1. Products
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  price integer not null,
  image text not null default '/placeholder.svg',
  specs jsonb not null default '[]',
  brand text not null default '',
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Reviews
create table if not exists reviews (
  id text primary key,
  name text not null,
  rating integer not null default 5,
  text text not null,
  date text not null default 'just now',
  photo_count integer not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Store Info (single-row config)
create table if not exists store_info (
  id text primary key default 'default',
  name text not null default 'MS Computer',
  name_marathi text not null default 'एमएस कंप्यूटर',
  tagline text not null default '',
  rating real not null default 5.0,
  review_count integer not null default 0,
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  hours text not null default '',
  map_link text not null default '',
  target_audience text not null default '',
  updated_at timestamptz not null default now()
);

-- 4. Orders
create table if not exists orders (
  id text primary key default gen_random_uuid()::text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null default '',
  delivery_address text not null,
  order_notes text not null default '',
  items jsonb not null default '[]',
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  grand_total integer not null default 0,
  payment_id text,
  payment_status text not null default 'pending',
  order_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Contact Messages
create table if not exists contact_messages (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  phone text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6. Order Items (normalized from JSONB)
create table if not exists order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_image text not null default '/placeholder.svg',
  product_price integer not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- 7. Order Status Log
create table if not exists order_status_log (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

-- 8. Wishlist (phone-based)
create table if not exists wishlist (
  id text primary key default gen_random_uuid()::text,
  phone text not null,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(phone, product_id)
);

-- ============================================
-- Indexes
-- ============================================
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_brand on products(brand);
create index if not exists idx_orders_status on orders(order_status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_orders_phone on orders(customer_phone);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_reviews_created on reviews(created_at desc);
create index if not exists idx_contact_created on contact_messages(created_at desc);
create index if not exists idx_contact_is_read on contact_messages(is_read);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_order_status_log_order on order_status_log(order_id);
create index if not exists idx_wishlist_phone on wishlist(phone);

-- ============================================
-- Row-Level Security (RLS)
-- ============================================
alter table products enable row level security;
alter table reviews enable row level security;
alter table store_info enable row level security;
alter table orders enable row level security;
alter table contact_messages enable row level security;
alter table order_items enable row level security;
alter table order_status_log enable row level security;
alter table wishlist enable row level security;

-- ============================================
-- RLS Policies
-- ============================================

-- Public read
drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);

drop policy if exists "Public read reviews" on reviews;
create policy "Public read reviews" on reviews for select using (true);

drop policy if exists "Public read store_info" on store_info;
create policy "Public read store_info" on store_info for select using (true);

drop policy if exists "Public read own orders" on orders;
create policy "Public read own orders" on orders for select using (true);

drop policy if exists "Public read own order_items" on order_items;
create policy "Public read own order_items" on order_items for select using (true);

drop policy if exists "Public read own order_status_log" on order_status_log;
create policy "Public read own order_status_log" on order_status_log for select using (true);

-- Public insert
drop policy if exists "Public insert orders" on orders;
create policy "Public insert orders" on orders for insert with check (true);

drop policy if exists "Public insert contact" on contact_messages;
create policy "Public insert contact" on contact_messages for insert with check (true);

-- Wishlist (public - keyed by phone)
drop policy if exists "Public manage own wishlist" on wishlist;
create policy "Public manage own wishlist" on wishlist for select using (true);

drop policy if exists "Public insert wishlist" on wishlist;
create policy "Public insert wishlist" on wishlist for insert with check (true);

drop policy if exists "Public delete wishlist" on wishlist;
create policy "Public delete wishlist" on wishlist for delete using (true);

-- Admin write (authenticated role)
drop policy if exists "Admin write products" on products;
create policy "Admin write products" on products for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write reviews" on reviews;
create policy "Admin write reviews" on reviews for all using (auth.role() = 'authenticated');

drop policy if exists "Admin write store_info" on store_info;
create policy "Admin write store_info" on store_info for all using (auth.role() = 'authenticated');

drop policy if exists "Admin read orders" on orders;
create policy "Admin read orders" on orders for select using (auth.role() = 'authenticated');

drop policy if exists "Admin update orders" on orders;
create policy "Admin update orders" on orders for update using (auth.role() = 'authenticated');

drop policy if exists "Admin read order_items" on order_items;
create policy "Admin read order_items" on order_items for select using (auth.role() = 'authenticated');

drop policy if exists "Admin read order_status_log" on order_status_log;
create policy "Admin read order_status_log" on order_status_log for select using (auth.role() = 'authenticated');

drop policy if exists "Admin insert order_status_log" on order_status_log;
create policy "Admin insert order_status_log" on order_status_log for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin read contact" on contact_messages;
create policy "Admin read contact" on contact_messages for select using (auth.role() = 'authenticated');

-- ============================================
-- Seed Data
-- ============================================
insert into store_info (id) values ('default')
on conflict (id) do nothing;
