/**
 * ZESTORA Product & Inventory Service
 */
import { INITIAL_PRODUCTS } from '../data/products.js';
import { getStorageItem, setStorageItem } from './storage';

const PRODUCTS_KEY = 'zestora_products';

export const productService = {
  getProducts() {
    const stored = getStorageItem(PRODUCTS_KEY, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      // Initialize with default stock property
      const initialized = INITIAL_PRODUCTS.map((p, idx) => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : (45 + idx * 15),
        lowStockThreshold: p.lowStockThreshold || 10,
        isActive: p.isActive !== undefined ? p.isActive : true,
        sku: p.sku || `ZST-${p.slug.toUpperCase().slice(0, 4)}-01`,
        shelfLife: p.shelfLife || '9 Months from packaging date'
      }));
      setStorageItem(PRODUCTS_KEY, initialized);
      return initialized;
    }
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

  addProduct(productData) {
    const products = this.getProducts();
    const slug = (productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, '');
    
    // Resolve primary and gallery images
    const mainImg = productData.image || productData.images?.main || productData.images?.thumbnail || '/assets/products/dried-mango.png';
    const thumbImg = productData.images?.thumbnail || mainImg;
    const galleryImgs = Array.isArray(productData.images?.gallery) && productData.images.gallery.length > 0
      ? productData.images.gallery
      : [mainImg];

    const newProduct = {
      id: `prod-${Date.now()}`,
      slug,
      name: productData.name,
      tagline: productData.tagline || 'Naturally Sweet & Crunchy.',
      description: productData.description || '',
      price: Number(productData.price) || 199,
      originalPrice: Number(productData.originalPrice) || Math.round((Number(productData.price) || 199) * 1.25),
      rating: 5.0,
      reviewCount: 0,
      category: productData.category || 'single',
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
      isBestSeller: Boolean(productData.isBestSeller)
    };

    const updated = [newProduct, ...products];
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, product: newProduct, products: updated };
  },

  updateProduct(id, updates) {
    const products = this.getProducts();
    const updated = products.map(p => {
      if (p.id === id || p.slug === id) {
        const mainImg = updates.image || updates.images?.main || p.image || p.images?.main || '/assets/products/dried-mango.png';
        const thumbImg = updates.images?.thumbnail || mainImg;
        const galleryImgs = updates.images?.gallery || p.images?.gallery || [mainImg];

        return {
          ...p,
          ...updates,
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
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  deleteProduct(id) {
    const products = this.getProducts();
    const updated = products.filter(p => p.id !== id && p.slug !== id);
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  toggleActive(id) {
    const products = this.getProducts();
    const updated = products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  },

  adjustStock(id, delta) {
    const products = this.getProducts();
    const updated = products.map(p => {
      if (p.id === id) {
        const nextStock = Math.max(0, (p.stock || 0) + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    setStorageItem(PRODUCTS_KEY, updated);
    return { success: true, products: updated };
  }
};
