// Zestora Data Types and Models (JavaScript)

/**
 * @typedef {'single' | 'chips' | 'bundle'} ProductCategory
 * @typedef {'upi_qr' | 'cod'} PaymentMethod
 * @typedef {'confirmed' | 'processing'} OrderStatus
 * @typedef {'home' | 'shop' | 'product-detail' | 'story' | 'why-zestora' | 'contact' | 'cart' | 'checkout' | 'order-confirmation'} PageRoute
 */

export const PAGE_ROUTES = [
  'home',
  'shop',
  'product-detail',
  'story',
  'why-zestora',
  'contact',
  'cart',
  'checkout',
  'order-confirmation'
];
