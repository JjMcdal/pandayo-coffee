-- Run this in the Supabase SQL editor (or via the CLI) to set up
-- Pandayo Coffee's roles, inventory, and POS tables.

-- 1. Role enum
create type user_role as enum ('owner', 'cashier', 'staff');

-- 2. Profiles table — one row per auth.users row, holds the role
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role user_role not null default 'staff',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- 3. Auto-create a profile row whenever an account is created.
-- There's no public sign-up page — accounts are created directly in
-- the Supabase dashboard, then promoted to the right role here.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'staff');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Menu items — what the cashier sells through POS
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  is_available boolean not null default true
);

alter table menu_items enable row level security;

create policy "Authenticated users can view menu items"
  on menu_items for select
  using (auth.role() = 'authenticated');

-- 5. Inventory items
create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- e.g. 'Raw materials', 'Packaging'
  quantity numeric not null default 0,
  unit text not null, -- e.g. 'kg', 'L', 'pcs'
  reorder_threshold numeric not null default 0,
  updated_at timestamptz not null default now()
);

alter table inventory_items enable row level security;

create policy "Authenticated users can view inventory"
  on inventory_items for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can manage inventory"
  on inventory_items for all
  using (auth.role() = 'authenticated');

-- 6. Links a menu item to the inventory it consumes, and how much of
-- that inventory item one sale uses up. This is what lets a POS sale
-- auto-deduct stock: sell one "Caramel macchiato" and it can draw down
-- both "Arabica beans" and "Whole milk" by their configured amounts.
create table menu_item_ingredients (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items (id) on delete cascade,
  inventory_item_id uuid not null references inventory_items (id) on delete cascade,
  quantity_used numeric not null
);

alter table menu_item_ingredients enable row level security;

create policy "Authenticated users can view recipe links"
  on menu_item_ingredients for select
  using (auth.role() = 'authenticated');

-- 7. Sales — one row per POS transaction
create table sales (
  id uuid primary key default gen_random_uuid(),
  cashier_id uuid references profiles (id),
  total numeric not null,
  created_at timestamptz not null default now()
);

alter table sales enable row level security;

create policy "Authenticated users can view sales"
  on sales for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create sales"
  on sales for insert
  with check (auth.role() = 'authenticated');

-- 8. Line items within a sale
create table sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references sales (id) on delete cascade,
  menu_item_id uuid not null references menu_items (id),
  quantity integer not null,
  subtotal numeric not null
);

alter table sale_items enable row level security;

create policy "Authenticated users can view sale items"
  on sale_items for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create sale items"
  on sale_items for insert
  with check (auth.role() = 'authenticated');

-- 9. Deduct inventory automatically whenever a sale_item is recorded,
-- based on that menu item's recipe (menu_item_ingredients). This is
-- the auto-deduct behind "POS sale -> inventory goes down".
create function public.deduct_inventory_on_sale()
returns trigger as $$
begin
  update inventory_items
  set quantity = inventory_items.quantity - (mi.quantity_used * new.quantity),
      updated_at = now()
  from menu_item_ingredients mi
  where mi.menu_item_id = new.menu_item_id
    and mi.inventory_item_id = inventory_items.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_sale_item_created
  after insert on sale_items
  for each row execute procedure public.deduct_inventory_on_sale();
