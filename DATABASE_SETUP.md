# ZESTORA — Supabase Database Setup & Migration Guide

This document provides step-by-step instructions to connect Zestora to a real **Supabase** backend (PostgreSQL database, Supabase Auth, Supabase Storage, and Row Level Security).

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in or sign up.
2. Click **New Project**.
3. Choose your organization, set the project name (e.g., `zestora-store`), set a strong database password, and select the region nearest your customers (e.g., `ap-south-1` Mumbai).
4. Click **Create new project** and wait ~1-2 minutes for provisioning to finish.

---

## 2. Get API Credentials

In your Supabase project dashboard:
1. Navigate to **Project Settings** (gear icon) > **API**.
2. Copy the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
3. Copy the **Project API Keys** > `anon` `public` key.

Create a `.env` file in the root of the Zestora project (or fill in your hosting environment variables):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

*(You can also configure these credentials dynamically from the **Admin Portal > Database Settings** tab).*

---

## 3. Run the Database Schema (SQL)

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy and paste the entire contents of `supabase/schema.sql` into the SQL editor.
4. Click **Run** (green button).

This sets up:
* `profiles` (integrated with `auth.users`, full name, phone, customer/admin roles)
* `categories` (active categories)
* `products` (fruit snacks, weights, nutrition, ingredients, pricing, stock)
* `orders` (live tracking, payment methods, shipping addresses, statuses)
* `order_items` (immutable historical product snapshots)
* `addresses` (customer shipping addresses with default address flag)
* `wishlists` (unique customer saved products)
* `reviews` (verified buyer reviews with star ratings and photos)
* `payments` (UPI UTR transaction references and verification audit)
* `notifications` (order updates and payment status alerts)
* `contact_messages` (customer contact inquiries and corporate bulk gifting)
* `newsletter_subscribers` (newsletter audience list)
* **Automatic Profile Trigger**: Automatically creates a record in `public.profiles` whenever a customer signs up.
* **Row Level Security (RLS)**: Enforces customer privacy so customers can only access their own data, while store administrators have full operational access.
* **Storage Buckets**: Pre-configures `product-images`, `review-images`, and `payment-screenshots`.

---

## 4. Run the Seed Data (SQL)

1. In the **SQL Editor**, click **New query**.
2. Copy and paste the contents of `supabase/seed.sql`.
3. Click **Run**.

This populates the initial fruit snacks (Dried Alphonso Mango, Queen Pineapple, Pink Guava, Banana Chips), categories, and authentic customer reviews.

---

## 5. Setup Storage Buckets (if not auto-created)

If your Supabase project requires manual bucket verification:
1. Go to **Storage** in the left sidebar.
2. Ensure the following 3 buckets exist:
   * **`product-images`** — Public: **Yes** (Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`)
   * **`review-images`** — Public: **Yes** (Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`)
   * **`payment-screenshots`** — Public: **No** (Private / secure authenticated access)

---

## 6. Create Your First Store Administrator

To set up an administrator account:

### Option A: Via Supabase Dashboard (Recommended)
1. Go to **Authentication** > **Users** > **Add User** > **Create User**.
2. Enter email (e.g., `admin@zestora.com`) and password (e.g., `AdminSecure2025!`). Check "Auto Confirm User".
3. Click **Create User**.
4. Then go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET role = 'admin', full_name = 'Zestora Store Administrator'
   WHERE email = 'admin@zestora.com';
   ```

### Option B: Via Zestora Admin Console
1. Launch the Zestora store and navigate to `/admin` or click **Admin Portal** in the footer.
2. If Supabase is connected, sign in with your admin credentials. If the user account doesn't exist yet, Zestora will register the account and promote it using the admin setup utility.

---

## 7. Row Level Security (RLS) Policy Summary

| Table | Anonymous / Public | Authenticated Customer | Administrator |
|---|---|---|---|
| `products` | Read Active (`active = true`) | Read Active | Full Access (Create, Read, Update, Delete) |
| `categories` | Read Active | Read Active | Full Access |
| `profiles` | No Access | Read/Update Own Profile (`id = auth.uid()`) | Full Access |
| `orders` | Insert Checkout Order | Read/Create Own Orders (`user_id = auth.uid()`) | Full Access |
| `order_items` | Insert with Order | Read Own Order Items | Full Access |
| `addresses` | No Access | Full CRUD on Own Addresses (`user_id = auth.uid()`) | Full Access |
| `wishlists` | No Access | Full CRUD on Own Wishlist (`user_id = auth.uid()`) | Full Access |
| `reviews` | Read Approved (`status = 'approved'`) | Read Approved + Submit Review | Full Access (Approve, Reject, Delete) |
| `payments` | Insert with Order | Read Own Payments | Full Access (Verify, Reject, Audit) |
| `notifications`| No Access | Read/Update Own Notifications | Full Access |
| `contact_messages` | Insert Message | Insert Message | Full Access (Read, Update Status, Delete) |
| `newsletter_subscribers` | Insert Email | Insert Email | Full Access (View, Export CSV) |

---

## 8. Graceful Fallback & Offline Mode

Zestora includes an intelligent data layer:
* **When Supabase credentials are provided**: The store connects directly to your live PostgreSQL database, Supabase Auth, and Storage buckets in real-time.
* **When Supabase credentials are not yet configured**: The store operates in seamless local storage fallback mode so customers and reviewers can still test every feature without application errors.
* **Data Migration Utility**: In **Admin Portal > Database Settings**, admins can click **"Test Connection"** and **"Sync Local Catalog to Supabase"** to seamlessly push products and seed data into Supabase with 1 click.
