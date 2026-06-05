insert into public.products
  (name, slug, description, price, sale_price, stock, gender_category, product_type, accessory_type, occasion, is_bestseller, is_on_sale)
values
  ('Aero Court Runner', 'aero-court-runner', 'Breathable everyday sneaker with sculpted support.', 5999, 4499, 42, 'men', 'shoes', null, 'casual', true, true),
  ('Noir Chelsea Boot', 'noir-chelsea-boot', 'Full-grain leather boot with slim festive profile.', 8999, null, 18, 'women', 'shoes', null, 'festive', true, false),
  ('Junior Flex Sandal', 'junior-flex-sandal', 'Lightweight kid-friendly sandal with secure grip.', 1999, 1499, 64, 'kids', 'shoes', null, 'casual', false, true),
  ('Heritage Leather Belt', 'heritage-leather-belt', 'Smooth leather belt with brushed buckle.', 2499, null, 35, 'unisex', 'accessories', 'belts', 'formal', false, false)
on conflict (slug) do nothing;
