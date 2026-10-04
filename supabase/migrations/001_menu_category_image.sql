-- Applied to the live Supabase project on 2026-10-01.
-- Adds the columns the new POS UI needs: category pills and product photos.
-- Do not re-run on the live database.

alter table menu_items
  add column if not exists category text not null default 'Others',
  add column if not exists image_url text; -- optional; POS shows initials when null

alter table menu_items
  add constraint menu_items_category_check
  check (category in ('Coffee', 'Non-Coffee', 'Pastries', 'Others'));