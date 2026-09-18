-- ================================================================
-- ZESTORA E-COMMERCE COMPLETE DATABASE MIGRATION & SCHEMA
-- Platform: Supabase PostgreSQL
-- Safe to execute on an empty or existing Supabase project.
-- ================================================================

-- 1. Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- TABLE: profiles
-- Links directly to Supabase auth.users
-- ================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to check if current user is an admin
-- Uses SECURITY DEFINER with search_path set to public to bypass RLS safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ================================================================
-- TABLE: categories
-- ================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ================================================================
-- TABLE: products
-- Stores all catalog snacks, packaging weights, nutrition & stock
-- ================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text,
  description text,
  category text DEFAULT 'single',
  image_url text,
  images jsonb DEFAULT '{"main": "", "thumbnail": "", "gallery": []}'::jsonb,
  price numeric NOT NULL DEFAULT 199,
  mrp numeric DEFAULT 249,
  discount numeric DEFAULT 0,
  weights jsonb DEFAULT '[{"label": "40g", "weightGrams": 40, "priceMultiplier": 1}]'::jsonb,
  default_weight text DEFAULT '40g',
  ingredients text,
  nutrition jsonb,
  benefits jsonb DEFAULT '[]'::jsonb,
  storage text,
  shelf_life text DEFAULT '9 Months from packaging date',
  sku text,
  stock integer DEFAULT 50,
  low_stock_threshold integer DEFAULT 10,
  active boolean DEFAULT true,
  is_best_seller boolean DEFAULT false,
  fruit_tone_color text DEFAULT '#E69A38',
  rating numeric DEFAULT 5.0,
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- ================================================================
-- TABLE: orders
-- Customer orders with live tracking, addresses & timeline
-- ================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  order_number text UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subtotal numeric NOT NULL,
  shipping_charge numeric DEFAULT 0,
  total numeric NOT NULL,
  payment_method text NOT NULL, -- 'upi_qr', 'cod'
  payment_status text DEFAULT 'pending', -- 'pending', 'verified', 'cod_pending', 'cod_collected', 'rejected', 'refunded'
  order_status text DEFAULT 'confirmed', -- 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
  shipping_address jsonb NOT NULL,
  customer_info jsonb NOT NULL,
  tracking_number text,
  courier_name text DEFAULT 'Delhivery Express',
  tracking_url text,
  estimated_delivery text,
  timeline jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ================================================================
-- TABLE: order_items
-- Immutable snapshots of purchased items ensuring historical records
-- are preserved even if products are edited or soft-deleted
-- ================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL DEFAULT 1,
  weight text DEFAULT '40g',
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ================================================================
-- TABLE: addresses
-- Customer saved delivery addresses
-- ================================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  house text,
  street text,
  area text,
  city text NOT NULL,
  state text NOT NULL DEFAULT 'Karnataka',
  pincode text NOT NULL,
  landmark text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

-- ================================================================
-- TABLE: wishlists
-- Saved favorites linked to user profile
-- ================================================================
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

-- ================================================================
-- TABLE: reviews
-- Customer product reviews (verified buyers only after delivery)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id text REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  image_url text,
  verified_purchase boolean DEFAULT true,
  approved boolean DEFAULT true,
  status text DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- ================================================================
-- TABLE: payments
-- UPI & COD transaction receipts, UTR numbers and payment proof
-- ================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payment_method text NOT NULL, -- 'upi_qr', 'cod'
  amount numeric NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'refunded'
  utr_number text,
  payment_screenshot_url text,
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_utr ON public.payments(utr_number);

-- ================================================================
-- TABLE: notifications
-- Customer order tracking alerts and payment confirmations
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general', -- 'order_status', 'payment', 'general'
  read boolean DEFAULT false,
  order_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ================================================================
-- TABLE: contact_messages
-- Customer inquiries and corporate bulk gifting orders
-- ================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text DEFAULT 'General Inquiry',
  message text NOT NULL,
  status text DEFAULT 'new', -- 'new', 'in_progress', 'resolved'
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);

-- ================================================================
-- TABLE: newsletter_subscribers
-- Storefront newsletter subscribers
-- ================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'Storefront Footer',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ================================================================
-- AUTOMATIC USER PROFILE TRIGGER
-- Automatically creates a public.profiles record on user signup.
-- FORCES role = 'customer' on signup (never self-escalate to admin).
-- ================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer' -- Explicitly set customer role on signup
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
      phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Prevent regular customers from modifying their role to 'admin'
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_user_role ON public.profiles;
CREATE TRIGGER trg_protect_user_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_user_role();

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- 1. Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile or admin can view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admin can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile or admin can update all" ON public.profiles;
CREATE POLICY "Users can update own profile or admin can update all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- 2. Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- 3. Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- 4. Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders or admins can view all" ON public.orders;
CREATE POLICY "Users can view their own orders or admins can view all"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 5. Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;
CREATE POLICY "Users can view order items for their orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Users can insert order items when creating order" ON public.order_items;
CREATE POLICY "Users can insert order items when creating order"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL OR public.is_admin())
    )
  );

-- 6. Addresses
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- 7. Wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own wishlist" ON public.wishlists;
CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlists FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- 8. Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helper function: verify if an authenticated user is eligible to review a product
-- Enforces: Order exists + Order belongs to user + Order status is 'delivered' + Order contains product
CREATE OR REPLACE FUNCTION public.can_review_product(p_user_id uuid, p_product_id text, p_order_id text)
RETURNS boolean AS $$
BEGIN
  IF p_user_id IS NULL OR p_order_id IS NULL OR p_product_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM public.orders o
    JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.id = p_order_id
      AND o.user_id = p_user_id
      AND o.order_status = 'delivered'
      AND (oi.product_id = p_product_id OR oi.product_id LIKE '%' || p_product_id || '%')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews FOR SELECT
  USING (approved = true OR status = 'approved' OR auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can submit reviews" ON public.reviews;
DROP POLICY IF EXISTS "Verified customers can submit reviews for delivered orders" ON public.reviews;
CREATE POLICY "Verified customers can submit reviews for delivered orders"
  ON public.reviews FOR INSERT
  WITH CHECK (
    public.is_admin() OR (
      auth.uid() = user_id AND
      order_id IS NOT NULL AND
      public.can_review_product(auth.uid(), product_id, order_id)
    )
  );

DROP POLICY IF EXISTS "Admins can update and delete reviews" ON public.reviews;
CREATE POLICY "Admins can update and delete reviews"
  ON public.reviews FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;
CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (public.is_admin());

-- 9. Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments or admins can view all" ON public.payments;
CREATE POLICY "Users can view their own payments or admins can view all"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert payment records for their orders" ON public.payments;
CREATE POLICY "Users can insert payment records for their orders"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
CREATE POLICY "Admins can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin());

-- 10. Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and update their own notifications" ON public.notifications;
CREATE POLICY "Users can view and update their own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- 11. Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());

-- 12. Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view and manage subscribers"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin());

-- ================================================================
-- STORAGE BUCKETS & POLICIES
-- Configures product-images, review-images, and payment-screenshots
-- ================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('review-images', 'review-images', true),
  ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Public can view review images" ON storage.objects;
CREATE POLICY "Public can view review images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS "Users can upload review images" ON storage.objects;
CREATE POLICY "Users can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users and admins can upload payment screenshots" ON storage.objects;
CREATE POLICY "Users and admins can upload payment screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'payment-screenshots');

DROP POLICY IF EXISTS "Admins can view payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Admins and owners can view payment screenshots" ON storage.objects;
CREATE POLICY "Admins and owners can view payment screenshots"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-screenshots' AND (
      public.is_admin() OR 
      (auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text)
    )
  );

-- ================================================================
-- STORED PROCEDURE: create_order_securely
-- Server-side validation:
-- 1. Validates product existence and active status
-- 2. Validates price and requested quantities
-- 3. Checks sufficient stock and prevents negative inventory
-- 4. Inserts order, order_items snapshots and payment in an atomic transaction
-- ================================================================
CREATE OR REPLACE FUNCTION public.create_order_securely(
  p_order_id text,
  p_items jsonb,
  p_customer_info jsonb,
  p_shipping_address jsonb,
  p_payment_method text,
  p_shipping_charge numeric DEFAULT 0,
  p_upi_ref text DEFAULT NULL,
  p_screenshot_url text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_item jsonb;
  v_prod_id text;
  v_req_qty int;
  v_unit_price numeric;
  v_item_total numeric;
  v_calculated_subtotal numeric := 0;
  v_final_total numeric := 0;
  v_current_stock int;
  v_prod_active boolean;
  v_prod_name text;
  v_prod_img text;
  v_prod_weight text;
  v_order_record public.orders%ROWTYPE;
BEGIN
  v_user_id := auth.uid();

  -- 1. Prevent duplicate order ID
  IF EXISTS (SELECT 1 FROM public.orders WHERE id = p_order_id) THEN
    RAISE EXCEPTION 'Order with ID % already exists', p_order_id;
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- 2. Validate products & stock in loop
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->'product'->>'id';
    IF v_prod_id IS NULL THEN
      v_prod_id := v_item->>'id';
    END IF;
    v_req_qty := COALESCE((v_item->>'quantity')::int, 1);

    IF v_req_qty <= 0 THEN
      RAISE EXCEPTION 'Invalid item quantity %', v_req_qty;
    END IF;

    -- Lookup product from database with row lock
    SELECT stock, active, price, name, default_weight, image_url
    INTO v_current_stock, v_prod_active, v_unit_price, v_prod_name, v_prod_weight, v_prod_img
    FROM public.products
    WHERE id = v_prod_id OR slug = v_prod_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found in database', v_prod_id;
    END IF;

    IF NOT v_prod_active THEN
      RAISE EXCEPTION 'Product % is currently inactive', v_prod_name;
    END IF;

    IF v_current_stock < v_req_qty THEN
      RAISE EXCEPTION 'Insufficient stock for %. Requested: %, Available: %', v_prod_name, v_req_qty, v_current_stock;
    END IF;

    -- Calculate verified pricing
    v_item_total := v_unit_price * v_req_qty;
    v_calculated_subtotal := v_calculated_subtotal + v_item_total;

    -- Deduct stock atomically to prevent negative inventory
    UPDATE public.products
    SET stock = stock - v_req_qty,
        updated_at = now()
    WHERE id = v_prod_id OR slug = v_prod_id;
  END LOOP;

  v_final_total := v_calculated_subtotal + COALESCE(p_shipping_charge, 0);

  -- 3. Insert into public.orders
  INSERT INTO public.orders (
    id,
    order_number,
    user_id,
    subtotal,
    shipping_charge,
    total,
    payment_method,
    payment_status,
    order_status,
    shipping_address,
    customer_info,
    tracking_number,
    courier_name,
    tracking_url,
    estimated_delivery,
    timeline
  ) VALUES (
    p_order_id,
    'ORD-' || substring(p_order_id from 5),
    v_user_id,
    v_calculated_subtotal,
    COALESCE(p_shipping_charge, 0),
    v_final_total,
    p_payment_method,
    CASE WHEN p_payment_method = 'upi_qr' THEN 'pending' ELSE 'cod_pending' END,
    'confirmed',
    p_shipping_address,
    p_customer_info,
    'ZST' || substring(p_order_id from 5) || 'IN',
    'Delhivery Express',
    'https://www.delhivery.com/track/package/ZST' || substring(p_order_id from 5) || 'IN',
    to_char(now() + interval '3 days', 'DD Mon YYYY'),
    jsonb_build_array(
      jsonb_build_object('status', 'placed', 'date', to_char(now(), 'DD Mon YYYY, HH12:MI AM'), 'label', 'Order Placed'),
      jsonb_build_object('status', 'confirmed', 'date', to_char(now(), 'DD Mon YYYY, HH12:MI AM'), 'label', 'Order Confirmed')
    )
  )
  RETURNING * INTO v_order_record;

  -- 4. Insert immutable order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_prod_id := v_item->'product'->>'id';
    IF v_prod_id IS NULL THEN
      v_prod_id := v_item->>'id';
    END IF;
    v_req_qty := COALESCE((v_item->>'quantity')::int, 1);

    SELECT name, price, default_weight, image_url
    INTO v_prod_name, v_unit_price, v_prod_weight, v_prod_img
    FROM public.products
    WHERE id = v_prod_id OR slug = v_prod_id;

    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_image,
      quantity,
      weight,
      unit_price,
      total_price
    ) VALUES (
      p_order_id,
      v_prod_id,
      COALESCE(v_prod_name, 'Zestora Fruit Snack'),
      COALESCE(v_prod_img, '/assets/products/dried-mango.png'),
      v_req_qty,
      COALESCE(v_item->>'selectedWeight', v_prod_weight, '40g'),
      v_unit_price,
      v_unit_price * v_req_qty
    );
  END LOOP;

  -- 5. Insert payment record
  INSERT INTO public.payments (
    order_id,
    user_id,
    payment_method,
    amount,
    status,
    utr_number,
    payment_screenshot_url
  ) VALUES (
    p_order_id,
    v_user_id,
    p_payment_method,
    v_final_total,
    CASE WHEN p_payment_method = 'upi_qr' THEN 'pending' ELSE 'cod_pending' END,
    p_upi_ref,
    p_screenshot_url
  );

  RETURN row_to_json(v_order_record)::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ================================================================
-- INITIAL SEED DATA (CATEGORIES, PRODUCTS & REVIEWS)
-- Ensures existing products and reviews are never lost
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
