import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';

// Read from Vite environment variables, or allow runtime override from localStorage for admin convenience
const getCredentials = () => {
  let url = import.meta.env.VITE_SUPABASE_URL || 'https://stkjicsieccswnfhbldy.supabase.co';
  let anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  // Check localStorage runtime overrides if set in Admin Database Settings
  try {
    const localUrl = localStorage.getItem('zestora_supabase_url');
    const localKey = localStorage.getItem('zestora_supabase_anon_key');
    if (localUrl && localKey) {
      url = localUrl;
      anonKey = localKey;
    }
  } catch {
    // Ignore localStorage access errors
  }

  return {
    url: url ? url.trim() : '',
    anonKey: anonKey ? anonKey.trim() : ''
  };
};

const credentials = getCredentials();

export const isSupabaseConfigured = () => {
  const creds = getCredentials();
  return Boolean(
    creds.url &&
    creds.anonKey &&
    creds.url.startsWith('https://') &&
    creds.url.includes('.supabase.co') &&
    creds.anonKey.length > 20 &&
    !creds.url.includes('your-project-id') &&
    !creds.anonKey.includes('your-anon-key')
  );
};

// Create the Supabase client
let supabaseInstance = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const creds = getCredentials();
  if (isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(creds.url, creds.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
};

// Re-initialize client (e.g. when user saves custom credentials in admin settings)
export const reinitializeSupabase = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem('zestora_supabase_url', url.trim());
    localStorage.setItem('zestora_supabase_anon_key', anonKey.trim());
    supabaseInstance = createClient(url.trim(), anonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
    return supabaseInstance;
  }
  localStorage.removeItem('zestora_supabase_url');
  localStorage.removeItem('zestora_supabase_anon_key');
  supabaseInstance = null;
  return null;
};

export const getSupabaseConfig = () => {
  const creds = getCredentials();
  return {
    url: creds.url,
    anonKey: creds.anonKey,
    isConfigured: isSupabaseConfigured()
  };
};

export const saveCustomSupabaseConfig = (url, anonKey) => {
  return reinitializeSupabase(url, anonKey);
};

export const supabase = getSupabase();

/**
 * Test connectivity with the configured Supabase project
 */
export const testSupabaseConnection = async () => {
  const client = getSupabase();
  if (!client) {
    return {
      connected: false,
      configured: false,
      error: 'Supabase URL or Anon Key is missing or using placeholder values.'
    };
  }

  try {
    const { data, error, count } = await client
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        configured: true,
        error: error.message || 'Database query returned an error'
      };
    }

    return {
      connected: true,
      configured: true,
      count: count ?? 0,
      message: 'Successfully connected to Supabase PostgreSQL database!'
    };
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: err.message || 'Network error connecting to Supabase.'
    };
  }
};

/**
 * Storage Helper: Upload a product image to 'product-images' bucket
 */
export const uploadProductImage = async (fileOrBlob, customFilename = null) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured');

  const fileExt = fileOrBlob.name ? fileOrBlob.name.split('.').pop() : 'jpg';
  const fileName = customFilename || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `catalog/${fileName}`;

  const { data, error } = await client.storage
    .from('product-images')
    .upload(filePath, fileOrBlob, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw error;
  }

  const { data: publicUrlData } = client.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

/**
 * Storage Helper: Upload a review image to 'review-images' bucket
 */
export const uploadReviewImage = async (fileOrBlob) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured');

  const fileExt = fileOrBlob.name ? fileOrBlob.name.split('.').pop() : 'jpg';
  const fileName = `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `reviews/${fileName}`;

  const { data, error } = await client.storage
    .from('review-images')
    .upload(filePath, fileOrBlob, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  const { data: publicUrlData } = client.storage
    .from('review-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

/**
 * Storage Helper: Upload a UPI payment screenshot to 'payment-screenshots' bucket
 */
export const uploadPaymentScreenshot = async (fileOrBlob, orderId) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase is not configured');

  const fileExt = fileOrBlob.name ? fileOrBlob.name.split('.').pop() : 'jpg';
  const fileName = `pay_${orderId || Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `upi/${fileName}`;

  const { data, error } = await client.storage
    .from('payment-screenshots')
    .upload(filePath, fileOrBlob, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  // Since payment-screenshots is private, return the path or public url if bucket is public
  const { data: urlData } = client.storage
    .from('payment-screenshots')
    .getPublicUrl(filePath);

  return urlData.publicUrl || filePath;
};

/**
 * Automatic / Manual Seeder: populate Supabase tables with initial Zestora data
 */
export const seedInitialDataToSupabase = async () => {
  const client = getSupabase();
  if (!client) return { success: false, error: 'Supabase is not configured' };

  try {
    // 1. Check existing products
    const { data: existing, error: checkErr } = await client
      .from('products')
      .select('id');

    if (checkErr) {
      return { success: false, error: checkErr.message };
    }

    if (existing && existing.length > 0) {
      return { success: true, message: `Database already has ${existing.length} products.` };
    }

    // 2. Insert Categories
    await client.from('categories').upsert([
      {
        id: 'cat-single',
        name: 'Single Fruit Slices',
        slug: 'single',
        description: 'Pure handpicked sun-ripened fruit slices dried with zero additives or oil.',
        image_url: '/assets/products/dried-mango.png',
        active: true
      },
      {
        id: 'cat-chips',
        name: 'Fruit Crisps & Chips',
        slug: 'chips',
        description: 'Thinly cut real fruit crisps warm-air dried to a golden crunch.',
        image_url: '/assets/products/dried-banana.png',
        active: true
      }
    ]);

    // 3. Insert Products
    const productsPayload = INITIAL_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      price: p.price,
      mrp: p.originalPrice || p.price + 50,
      discount: Math.round((( (p.originalPrice || p.price + 50) - p.price) / (p.originalPrice || p.price + 50)) * 100),
      category: p.category || 'single',
      default_weight: p.defaultWeight || '40g',
      weights: p.netWeights || [{ label: '40g', weightGrams: 40, priceMultiplier: 1 }],
      images: p.images || { main: p.image, thumbnail: p.image, gallery: [p.image] },
      image_url: p.images?.main || p.image || '/assets/products/dried-mango.png',
      ingredients: p.ingredients,
      nutrition: p.nutritionInfo,
      storage: p.storage,
      shelf_life: '9 Months from packaging date',
      sku: `ZST-${p.slug.toUpperCase()}-40`,
      stock: 50,
      low_stock_threshold: 10,
      fruit_tone_color: p.fruitToneColor || '#E69A38',
      is_best_seller: Boolean(p.isBestSeller),
      active: true,
      rating: p.rating || 5.0,
      review_count: p.reviewCount || 0
    }));

    const { error: prodErr } = await client.from('products').upsert(productsPayload);
    if (prodErr) return { success: false, error: prodErr.message };

    // 4. Insert Initial Reviews
    const reviewsPayload = [];
    Object.entries(INITIAL_REVIEWS).forEach(([prodId, revList]) => {
      revList.forEach(r => {
        reviewsPayload.push({
          product_id: prodId,
          customer_name: r.customerName,
          rating: r.rating,
          review_text: r.reviewText,
          verified_purchase: true,
          approved: true,
          status: 'approved'
        });
      });
    });

    if (reviewsPayload.length > 0) {
      await client.from('reviews').insert(reviewsPayload);
    }

    return {
      success: true,
      message: `Successfully seeded ${productsPayload.length} fruit snack products and ${reviewsPayload.length} reviews to Supabase!`
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
