/**
 * ZESTORA Product & Inventory Service
 * Integrates Supabase PostgreSQL products table with fast local caching.
 */
import { INITIAL_PRODUCTS } from '../data/products.js';
import { getStorageItem, setStorageItem } from './storage.js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase.js';

const PRODUCTS_KEY = 'zestora_products';

let _productsCache = null;

// Map a Supabase row to frontend product format
const formatFromSupabase = (row) => {
  const mainImg = row.images?.main || row.image_url || '/assets/products/dried-mango.png';
  const thumbImg = row.images?.thumbnail || mainImg;
  const galleryImgs = Array.isArray(row.images?.gallery) && row.images.gallery.length > 0
    ? row.images.gallery
    : [mainImg];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || 'A Taste of Sunshine.',
    description: row.description || '',
    price: Number(row.price) || 199,
    originalPrice: Number(row.mrp) || Math.round((Number(row.price) || 199) * 1.25),
    rating: Number(row.rating) || 5.0,
    reviewCount: Number(row.review_count) || 0,
    category: row.category || 'single',
    netWeights: row.weights || [{ label: '40g', weightGrams: 40, priceMultiplier: 1 }],
    defaultWeight: row.default_weight || '40g',
    image: mainImg,
    images: {
      main: mainImg,
      thumbnail: thumbImg,
      gallery: galleryImgs
    },
    ingredients: row.ingredients || '100% Pure Natural Fruit. Zero preservatives.',
    nutritionInfo: row.nutrition || {
      servingSize: '40g',
      calories: '128 kcal',
      carbohydrates: '30g',
      naturalSugars: '25g',
      addedSugars: '0g',
      dietaryFiber: '3.2g',
      protein: '1.1g',
      fat: '0.3g'
    },
    storage: row.storage || 'Store in a cool, dry place away from direct sunlight.',
    shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India.',
    tastingNotes: row.benefits || ['Naturally Sweet', 'Rich Aroma', 'Satisfying Chew'],
    fruitToneColor: row.fruit_tone_color || '#E69A38',
    shelfLife: row.shelf_life || '9 Months from packaging date',
    stock: row.stock !== undefined ? Number(row.stock) : 50,
    lowStockThreshold: Number(row.low_stock_threshold) || 10,
    sku: row.sku || `ZST-${row.slug.toUpperCase().slice(0, 4)}-01`,
    isActive: row.active !== undefined ? Boolean(row.active) : true,
    isBestSeller: Boolean(row.is_best_seller)
  };
};

export const productService = {
  getProducts() {
    if (_productsCache && Array.isArray(_productsCache) && _productsCache.length > 0) {
      return _productsCache;
    }
    const stored = getStorageItem(PRODUCTS_KEY, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      const initialized = INITIAL_PRODUCTS.map((p, idx) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : (45 + idx * 15),
        lowStockThreshold: p.lowStockThreshold || 10,
        isActive: p.isActive !== undefined ? p.isActive : true,
        sku: p.sku || `ZST-${p.slug.toUpperCase().slice(0, 4)}-01`,
        shelfLife: p.shelfLife || '9 Months from packaging date'
      }));
      setStorageItem(PRODUCTS_KEY, initialized);
      _productsCache = initialized;
      return initialized;
    }
    _productsCache = stored;
    return stored;
  },

  getActiveProducts() {
    return this.getProducts().filter(p => p.isActive !== false);
  },

  getProductBySlug(slug) {
    const products = this.getProducts();
    return products.find(p => p.slug === slug) || products[0];
  },

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  },

  /**
   * Fetch latest products from Supabase database
   */
  async fetchFromDatabase() {
    const supabase = getSupabase();
    if (!isSupabaseConfigured() || !supabase) {
      return this.getProducts();
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch products error:', error.message);
        return this.getProducts();
      }

      if (data && data.length > 0) {
        const formatted = data.map(formatFromSupabase);
        _productsCache = formatted;
        setStorageItem(PRODUCTS_KEY, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Network error loading products from Supabase:', err);
    }
    return this.getProducts();
  },

  async addProduct(productData) {
    const products = this.getProducts();
    const baseSlug = (productData.slug || (productData.name ? productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')).replace(/(^-|-$)/g, '') || `snack-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (products.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const mainImg = productData.image || productData.images?.main || productData.images?.thumbnail || '/assets/products/dried-mango.png';
    const thumbImg = productData.images?.thumbnail || mainImg;
    const galleryImgs = Array.isArray(productData.images?.gallery) && productData.images.gallery.length > 0
      ? productData.images.gallery
      : [mainImg];

    const rawCategory = productData.category || 'single';
    const category = rawCategory === 'gift' ? 'bundle' : rawCategory;
    const prodId = `prod-${Date.now()}`;

    const newProduct = {
      id: prodId,
      slug,
      name: productData.name,
      tagline: productData.tagline || 'Naturally Sweet & Crunchy.',
      description: productData.description || 'Slow dehydrated fruit with zero added sugar and zero preservatives.',
      price: Number(productData.price) || 199,
      originalPrice: Number(productData.originalPrice) || Math.round((Number(productData.price) || 199) * 1.25),
      rating: 5.0,
      reviewCount: 0,
      category,
      netWeights: productData.netWeights || [{ label: '40g', weightGrams: 40, priceMultiplier: 1 }],
      defaultWeight: productData.defaultWeight || '40g',
      image: mainImg,
      images: {
        main: mainImg,
        thumbnail: thumbImg,
        gallery: galleryImgs
      },
      ingredients: productData.ingredients || '100% Pure Natural Fruit. Zero preservatives.',
      nutritionInfo: productData.nutritionInfo || {
        servingSize: '40g',
        calories: '120 kcal',
        carbohydrates: '28g',
        naturalSugars: '22g',
        addedSugars: '0g',
        dietaryFiber: '3.0g',
        protein: '1.0g',
        fat: '0.2g'
      },
      storage: productData.storage || 'Store in a cool, dry place away from direct sunlight.',
      shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India.',
      tastingNotes: productData.tastingNotes || ['Naturally Sweet', 'Rich Aroma', 'Satisfying Chew'],
      shelfLife: productData.shelfLife || '9 Months from packaging date',
      stock: Number(productData.stock) !== undefined && productData.stock !== '' ? Number(productData.stock) : 50,
      lowStockThreshold: Number(productData.lowStockThreshold) || 10,
      sku: productData.sku || `ZST-${slug.toUpperCase().slice(0, 4)}-01`,
      isActive: true,
      isBestSeller: Boolean(productData.isBestSeller),
      fruitToneColor: productData.fruitToneColor || '#E69A38'
    };

    // Try Supabase insert
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').insert({
          id: newProduct.id,
          name: newProduct.name,
          slug: newProduct.slug,
          tagline: newProduct.tagline,
          description: newProduct.description,
          price: newProduct.price,
          mrp: newProduct.originalPrice,
          category: newProduct.category,
          default_weight: newProduct.defaultWeight,
          weights: newProduct.netWeights,
          images: newProduct.images,
          image_url: newProduct.image,
          ingredients: newProduct.ingredients,
          nutrition: newProduct.nutritionInfo,
          storage: newProduct.storage,
          shelf_life: newProduct.shelfLife,
          sku: newProduct.sku,
          stock: newProduct.stock,
          low_stock_threshold: newProduct.lowStockThreshold,
          active: true,
          is_best_seller: newProduct.isBestSeller,
          fruit_tone_color: newProduct.fruitToneColor,
          rating: 5.0,
          review_count: 0
        });
      } catch (err) {
        console.warn('Supabase addProduct error:', err);
      }
    }

    const updated = [newProduct, ...products];
    _productsCache = updated;
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, product: newProduct, products: updated };
  },

  async updateProduct(id, updates) {
    const products = this.getProducts();
    const updated = products.map(p => {
      if (p.id === id || p.slug === id) {
        const mainImg = updates.image || updates.images?.main || p.image || p.images?.main || '/assets/products/dried-mango.png';
        const thumbImg = updates.images?.thumbnail || mainImg;
        const galleryImgs = updates.images?.gallery || p.images?.gallery || [mainImg];
        const rawCategory = updates.category !== undefined ? updates.category : p.category;
        const category = rawCategory === 'gift' ? 'bundle' : rawCategory;

        return {
          ...p,
          ...updates,
          category,
          image: mainImg,
          images: {
            main: mainImg,
            thumbnail: thumbImg,
            gallery: galleryImgs
          },
          price: updates.price !== undefined ? Number(updates.price) : p.price,
          originalPrice: updates.originalPrice !== undefined ? Number(updates.originalPrice) : p.originalPrice,
          stock: updates.stock !== undefined ? Number(updates.stock) : p.stock,
          lowStockThreshold: updates.lowStockThreshold !== undefined ? Number(updates.lowStockThreshold) : p.lowStockThreshold
        };
      }
      return p;
    });

    const targetProduct = updated.find(p => p.id === id || p.slug === id);

    // Try Supabase update
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase && targetProduct) {
      try {
        await supabase
          .from('products')
          .update({
            name: targetProduct.name,
            tagline: targetProduct.tagline,
            description: targetProduct.description,
            price: targetProduct.price,
            mrp: targetProduct.originalPrice,
            category: targetProduct.category,
            stock: targetProduct.stock,
            low_stock_threshold: targetProduct.lowStockThreshold,
            active: targetProduct.isActive,
            images: targetProduct.images,
            image_url: targetProduct.image,
            ingredients: targetProduct.ingredients,
            nutrition: targetProduct.nutritionInfo,
            updated_at: new Date().toISOString()
          })
          .eq('id', targetProduct.id);
      } catch (err) {
        console.warn('Supabase updateProduct error:', err);
      }
    }

    _productsCache = updated;
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  async deleteProduct(id) {
    const products = this.getProducts();
    // Soft deletion in Supabase: active = false
    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({ active: false, updated_at: new Date().toISOString() })
          .or(`id.eq.${id},slug.eq.${id}`);
      } catch (err) {
        console.warn('Supabase deleteProduct error:', err);
      }
    }

    const updated = products.filter(p => p.id !== id && p.slug !== id);
    _productsCache = updated;
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  async toggleActive(id) {
    const products = this.getProducts();
    let nextActive = true;
    const updated = products.map(p => {
      if (p.id === id) {
        nextActive = !p.isActive;
        return { ...p, isActive: nextActive };
      }
      return p;
    });

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({ active: nextActive, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase toggleActive error:', err);
      }
    }

    _productsCache = updated;
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  async adjustStock(id, delta) {
    const products = this.getProducts();
    let newStock = 0;
    const updated = products.map(p => {
      if (p.id === id) {
        newStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: newStock };
      }
      return p;
    });

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({ stock: newStock, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase adjustStock error:', err);
      }
    }

    _productsCache = updated;
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  }
};
