# Pandayo Coffee — Login, POS, Inventory, Admin

Flow: **Log in → POS → Inventory → Admin**, gated by role.

## Roles

- **Owner** — full access to Admin, POS, and Inventory.
- **Cashier** — POS only.
- **Staff** — Inventory only.

There's no public sign-up page. Accounts are created directly in the
Supabase dashboard (Authentication > Users), then given a role by
editing their row in `profiles`.

## Pages

- `/` — public landing page, no login needed.
- `/login` — email/password login. After logging in, each role lands
  on its own home page (owner → `/admin`, cashier → `/pos`,
  staff → `/inventory`).
- `/pos` — cashier (and owner) records a sale against the menu. Each
  sale automatically deducts inventory based on that menu item's
  recipe — see `menu_item_ingredients` in the schema.
- `/inventory` — staff (and owner) view current stock levels and
  what's running low.
- `/admin` — owner only. Recent sales, transaction count, and
  low-stock summary in one place.

## How access control works

`lib/supabase/middleware.ts` runs on every request:

- `/` and `/login` are public.
- Everything else requires a session — logged-out visitors are sent
  to `/login`.
- Once logged in, the user's `role` (from `profiles`) decides which
  of `/admin`, `/pos`, `/inventory` they're allowed into. Owner gets
  all three; cashier and staff are redirected back to their own
  section if they try to reach one that isn't theirs.

## How the auto-deduct works

1. `menu_items` — what's sellable through POS.
2. `menu_item_ingredients` — the "recipe": how much of each
   `inventory_items` row one sale of a menu item consumes.
3. When a sale is recorded, `sale_items` rows are inserted for each
   item sold.
4. A database trigger (`on_sale_item_created` in `schema.sql`) fires
   on that insert and subtracts the recipe's quantities from
   `inventory_items`. The POS action itself never touches inventory
   directly — that keeps the deduction logic in one place.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. This creates the
   `user_role` enum, `profiles` (with an auto-create trigger,
   defaulting to `staff`), `menu_items`, `inventory_items`,
   `menu_item_ingredients`, `sales`, and `sale_items`.
3. Copy `.env.local.example` to `.env.local` and fill in your project
   URL and anon key.
4. In Supabase, create at least one account per role and set their
   `role` in `profiles` (owner / cashier / staff), and add a few rows
   to `menu_items` and `inventory_items` so there's something to sell
   and track.
5. `npm install`
6. `npm run dev`

## Next steps

- Add/edit inventory items and menu items from the UI (currently
  seeded directly in the database)
- Receipt/printout for completed sales
- Jest/Playwright tests + GitHub Actions CI


<!-- test-marker-12345 -->