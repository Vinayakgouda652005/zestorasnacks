-- ================================================================
-- ZESTORA INITIAL SEED DATA FOR SUPABASE
-- ================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, active)
VALUES
  ('cat-single', 'Single Fruit Slices', 'single', 'Pure handpicked sun-ripened fruit slices dried with zero additives or oil.', '/assets/products/dried-mango.png', true),
  ('cat-chips', 'Fruit Crisps & Chips', 'chips', 'Thinly cut real fruit crisps warm-air dried to a golden crunch.', '/assets/products/dried-banana.png', true)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Insert Products
INSERT INTO public.products (
  id, name, slug, tagline, description, price, mrp, discount,
  category, default_weight, weights, images, ingredients, nutrition,
  storage, shelf_life, sku, stock, low_stock_threshold,
  fruit_tone_color, is_best_seller, active, rating, review_count
)
VALUES
(
  'prod-mango',
  'Dried Mango',
  'dried-mango',
  'A Taste of Sunshine.',
  'Sweet, juicy, and full of tropical goodness — our dried mango slices are made from handpicked ripe mangoes, slowly dried to lock in their natural flavour and nutrients. A perfect snack for any time of the day.',
  199,
  249,
  20,
  'single',
  '40g',
  '[{"label": "40g", "weightGrams": 40, "priceMultiplier": 1}]'::jsonb,
  '{
    "main": "/assets/products/dried-mango.png",
    "thumbnail": "/assets/products/dried-mango.png",
    "gallery": [
      "/assets/products/dried-mango.png",
      "/assets/products/hero-dried-mango.jpg",
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80"
    ]
  }'::jsonb,
  '100% Sun-Ripened Alphonso Mango. Zero preservatives, zero added sugar.',
  '{
    "servingSize": "40g",
    "calories": "128 kcal",
    "carbohydrates": "30g",
    "naturalSugars": "25g",
    "addedSugars": "0g",
    "dietaryFiber": "3.2g",
    "protein": "1.1g",
    "fat": "0.3g"
  }'::jsonb,
  'Store in a cool, dry place away from direct sunlight. Reseal pouch tightly after opening to preserve crunch and chewiness.',
  '9 Months from packaging date',
  'ZST-MNG-40',
  85,
  15,
  '#E69A38',
  true,
  true,
  5.0,
  126
),
(
  'prod-pineapple',
  'Dried Pineapple',
  'dried-pineapple',
  'Tropical Goodness.',
  'Succulent Queen pineapple wheels harvested at peak ripeness and slow-dried. A burst of vibrant natural acidity and caramelized sweetness in every fiber-packed bite.',
  199,
  249,
  20,
  'single',
  '40g',
  '[{"label": "40g", "weightGrams": 40, "priceMultiplier": 1}]'::jsonb,
  '{
    "main": "/assets/products/dried-pineapple.png",
    "thumbnail": "/assets/products/dried-pineapple.png",
    "gallery": [
      "/assets/products/dried-pineapple.png",
      "/assets/products/hero-dried-pineapple.jpg",
      "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=600&q=80"
    ]
  }'::jsonb,
  '100% Pure Queen Pineapple. Zero preservatives, zero added sugar.',
  '{
    "servingSize": "40g",
    "calories": "124 kcal",
    "carbohydrates": "29g",
    "naturalSugars": "23g",
    "addedSugars": "0g",
    "dietaryFiber": "3.6g",
    "protein": "0.9g",
    "fat": "0.2g"
  }'::jsonb,
  'Store in a cool, dark pantry. Reseal zip seal firmly after each use.',
  '9 Months from packaging date',
  'ZST-PIN-40',
  60,
  15,
  '#E2B338',
  true,
  true,
  5.0,
  98
),
(
  'prod-guava',
  'Dried Guava',
  'dried-guava',
  'Tangy. Crunchy. Naturally Yours.',
  'Fragrant pink guava wedges delicately sprinkled with a micro-pinch of Himalayan pink salt. The nostalgic flavor of afternoon orchard fruits brought to life in a clean, crunchy-chewy snack.',
  199,
  239,
  17,
  'single',
  '40g',
  '[{"label": "40g", "weightGrams": 40, "priceMultiplier": 1}]'::jsonb,
  '{
    "main": "/assets/products/dried-guava.png",
    "thumbnail": "/assets/products/dried-guava.png",
    "gallery": [
      "/assets/products/dried-guava.png",
      "/assets/products/hero-dried-guava.jpg",
      "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80"
    ]
  }'::jsonb,
  'Naturally Dried Pink Guava (99.6%), Mineral Pink Salt (0.4%).',
  '{
    "servingSize": "40g",
    "calories": "118 kcal",
    "carbohydrates": "27g",
    "naturalSugars": "20g",
    "addedSugars": "0g",
    "dietaryFiber": "4.8g",
    "protein": "1.4g",
    "fat": "0.3g"
  }'::jsonb,
  'Keep in an airtight container or original resealable pouch. Protect from heat and moisture.',
  '9 Months from packaging date',
  'ZST-GVA-40',
  42,
  12,
  '#D26466',
  false,
  true,
  5.0,
  76
),
(
  'prod-banana',
  'Dried Banana Chips',
  'dried-banana',
  'Naturally Sweet. Always a Classic.',
  'Thinly cut slices of ripe South Indian Nendran bananas, slowly warm-air dried to a crisp snap. Zero palm oil, zero frying, and zero added sugar — purely the natural sweetness of ripe bananas.',
  149,
  189,
  21,
  'chips',
  '40g',
  '[{"label": "40g", "weightGrams": 40, "priceMultiplier": 1}]'::jsonb,
  '{
    "main": "/assets/products/dried-banana.png",
    "thumbnail": "/assets/products/dried-banana.png",
    "gallery": [
      "/assets/products/dried-banana.png",
      "/assets/products/hero-dried-banana.jpg",
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80"
    ]
  }'::jsonb,
  '100% Naturally Dehydrated Nendran Bananas. Non-fried.',
  '{
    "servingSize": "40g",
    "calories": "138 kcal",
    "carbohydrates": "32g",
    "naturalSugars": "18g",
    "addedSugars": "0g",
    "dietaryFiber": "2.8g",
    "protein": "1.6g",
    "fat": "0.4g"
  }'::jsonb,
  'Store in a cool dry cabinet. Ensure pouch is tightly closed after opening to keep crunch.',
  '9 Months from packaging date',
  'ZST-BAN-40',
  75,
  15,
  '#DFB448',
  false,
  true,
  5.0,
  112
)
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  images = EXCLUDED.images;

-- 3. Insert Initial Approved Reviews
INSERT INTO public.reviews (product_id, customer_name, rating, review_text, verified_purchase, approved, status)
VALUES
  ('prod-mango', 'Ananya S.', 5, 'Absolutely loved the taste! Super fresh and healthy snack. Will definitely order again.', true, true, 'approved'),
  ('prod-mango', 'Rohan M.', 5, 'Perfect balance of sweetness and chew. Feels premium and natural.', true, true, 'approved'),
  ('prod-mango', 'Sneha P.', 5, 'Tastes just like real mangoes! My go-to healthy snack now.', true, true, 'approved'),
  ('prod-pineapple', 'Siddharth V.', 5, 'Incredible balance of acidity and sweet caramelized pineapple notes. Most store-bought dried pineapples are soaked in sugar syrup, but this one is completely honest fruit.', true, true, 'approved'),
  ('prod-pineapple', 'Pooja Iyer', 5, 'Great tangy kick! Perfect afternoon pick-me-up at my work desk. Arrived neatly packaged in 2 days.', true, true, 'approved'),
  ('prod-guava', 'Meera Nambiar', 5, 'The pink guava with the slight touch of pink salt brought back childhood memories of street fruit carts. The aroma is heavenly when you open the pouch.', true, true, 'approved'),
  ('prod-guava', 'Arjun Sen', 5, 'Hands down my favorite flavor from Zestora. The texture has a pleasant soft bite and the fiber makes it genuinely filling.', true, true, 'approved'),
  ('prod-banana', 'Vikram Patel', 5, 'Finally a banana chip that is NOT deep fried in heavy palm or coconut oil! Clean, crisp, and you taste the authentic Nendran banana sweetness.', true, true, 'approved'),
  ('prod-banana', 'Sunita Roy', 5, 'Very crunchy and light. Love having this with evening black tea. Great guilt-free snack.', true, true, 'approved')
ON CONFLICT DO NOTHING;
