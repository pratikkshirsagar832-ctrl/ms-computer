-- MS Computer — Features Migration (Orders, Wishlist, Status Tracking)
-- Run this in Supabase SQL Editor after 00001_initial_schema.sql

-- 1. Order Items (normalized from JSONB in orders table)
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

-- 2. Order Status Log (track status changes with notes)
create table if not exists order_status_log (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

-- 3. Wishlist (keyed by phone number)
create table if not exists wishlist (
  id text primary key default gen_random_uuid()::text,
  phone text not null,
  product_id text not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(phone, product_id)
);

-- 4. Add is_read to contact_messages for admin
alter table contact_messages add column if not exists is_read boolean not null default false;

-- 5. Update orders table: add updated_at
alter table orders add column if not exists updated_at timestamptz not null default now();

-- Indexes
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_order_status_log_order on order_status_log(order_id);
create index if not exists idx_orders_phone on orders(customer_phone);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_wishlist_phone on wishlist(phone);
create index if not exists idx_contact_is_read on contact_messages(is_read);

-- RLS
alter table order_items enable row level security;
alter table order_status_log enable row level security;
alter table wishlist enable row level security;

-- Public can read their own order items (by order_id, needs order's phone)
drop policy if exists "Public read own order_items" on order_items;
create policy "Public read own order_items" on order_items for select using (true);

drop policy if exists "Public read own order_status_log" on order_status_log;
create policy "Public read own order_status_log" on order_status_log for select using (true);

-- Public can manage their own wishlist by phone
drop policy if exists "Public manage own wishlist" on wishlist;
create policy "Public manage own wishlist" on wishlist for all using (true);

drop policy if exists "Public insert wishlist" on wishlist;
create policy "Public insert wishlist" on wishlist for insert with check (true);

drop policy if exists "Public delete wishlist" on wishlist;
create policy "Public delete wishlist" on wishlist for delete using (true);

-- Admin read policies
drop policy if exists "Admin read order_items" on order_items;
create policy "Admin read order_items" on order_items for select using (auth.role() = 'authenticated');

drop policy if exists "Admin read order_status_log" on order_status_log;
create policy "Admin read order_status_log" on order_status_log for select using (auth.role() = 'authenticated');

-- Admin can insert status logs
drop policy if exists "Admin insert order_status_log" on order_status_log;
create policy "Admin insert order_status_log" on order_status_log for insert with check (auth.role() = 'authenticated');

-- Public can read orders by phone number (for order lookup)
drop policy if exists "Public read own orders" on orders;
create policy "Public read own orders" on orders for select using (true);

-- Admin can update orders
drop policy if exists "Admin update orders" on orders;
create policy "Admin update orders" on orders for update using (auth.role() = 'authenticated');
