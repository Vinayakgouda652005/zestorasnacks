
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-mango',
    slug: 'dried-mango',
    name: 'Dried Mango',
    tagline: 'A Taste of Sunshine.',
    description: 'Sweet, juicy, and full of tropical goodness — our dried mango slices are made from handpicked ripe mangoes, slowly dried to lock in their natural flavour and nutrients. A perfect snack for any time of the day.',
    price: 199,
    originalPrice: 249,
    rating: 5.0,
    reviewCount: 126,
    category: 'single',
    netWeights: [
      { label: '40g', weightGrams: 40, priceMultiplier: 1 }
    ],
    defaultWeight: '40g',
    images: {
      main: '/assets/products/dried-mango.png',
      thumbnail: '/assets/products/dried-mango.png',
      gallery: [
        '/assets/products/dried-mango.png',
        '/assets/products/hero-dried-mango.jpg',
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80'
      ]
    },
    ingredients: '100% Sun-Ripened Alphonso Mango. Zero preservatives, zero added sugar.',
    nutritionInfo: {
      servingSize: '40g',
      calories: '128 kcal',
      carbohydrates: '30g',
      naturalSugars: '25g',
      addedSugars: '0g',
      dietaryFiber: '3.2g',
      protein: '1.1g',
      fat: '0.3g'
    },
    storage: 'Store in a cool, dry place away from direct sunlight. Reseal pouch tightly after opening to preserve crunch and chewiness.',
    shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India. Delivered via express courier in 2-4 business days.',
    tastingNotes: ['Naturally Sweet', 'Rich Tropical Aroma', 'Satisfyingly Chewy', 'Alphonso Tang'],
    fruitToneColor: '#E69A38',
    isBestSeller: true
  },
  {
    id: 'prod-pineapple',
    slug: 'dried-pineapple',
    name: 'Dried Pineapple',
    tagline: 'Tropical Goodness.',
    description: 'Succulent Queen pineapple wheels harvested at peak ripeness and slow-dried. A burst of vibrant natural acidity and caramelized sweetness in every fiber-packed bite.',
    price: 199,
    originalPrice: 249,
    rating: 5.0,
    reviewCount: 98,
    category: 'single',
    netWeights: [
      { label: '40g', weightGrams: 40, priceMultiplier: 1 }
    ],
    defaultWeight: '40g',
    images: {
      main: '/assets/products/dried-pineapple.png',
      thumbnail: '/assets/products/dried-pineapple.png',
      gallery: [
        '/assets/products/dried-pineapple.png',
        '/assets/products/hero-dried-pineapple.jpg',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1589533610925-1cffc309ebaa?auto=format&fit=crop&w=600&q=80'
      ]
    },
    ingredients: '100% Pure Queen Pineapple. Zero preservatives, zero added sugar.',
    nutritionInfo: {
      servingSize: '40g',
      calories: '124 kcal',
      carbohydrates: '29g',
      naturalSugars: '23g',
      addedSugars: '0g',
      dietaryFiber: '3.6g',
      protein: '0.9g',
      fat: '0.2g'
    },
    storage: 'Store in a cool, dark pantry. Reseal zip seal firmly after each use.',
    shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India.',
    tastingNotes: ['Bright Citrus Zing', 'Golden Caramelized Finish', 'Fiber-Rich Chew', 'Tropical Sunshine'],
    fruitToneColor: '#E2B338',
    isBestSeller: true
  },
  {
    id: 'prod-guava',
    slug: 'dried-guava',
    name: 'Dried Guava',
    tagline: 'Tangy. Crunchy. Naturally Yours.',
    description: 'Fragrant pink guava wedges delicately sprinkled with a micro-pinch of Himalayan pink salt. The nostalgic flavor of afternoon orchard fruits brought to life in a clean, crunchy-chewy snack.',
    price: 199,
    originalPrice: 239,
    rating: 5.0,
    reviewCount: 76,
    category: 'single',
    netWeights: [
      { label: '40g', weightGrams: 40, priceMultiplier: 1 }
    ],
    defaultWeight: '40g',
    images: {
      main: '/assets/products/dried-guava.png',
      thumbnail: '/assets/products/dried-guava.png',
      gallery: [
        '/assets/products/dried-guava.png',
        '/assets/products/hero-dried-guava.jpg',
        'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80'
      ]
    },
    ingredients: 'Naturally Dried Pink Guava (99.6%), Mineral Pink Salt (0.4%).',
    nutritionInfo: {
      servingSize: '40g',
      calories: '118 kcal',
      carbohydrates: '27g',
      naturalSugars: '20g',
      addedSugars: '0g',
      dietaryFiber: '4.8g',
      protein: '1.4g',
      fat: '0.3g'
    },
    storage: 'Keep in an airtight container or original resealable pouch. Protect from heat and moisture.',
    shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India.',
    tastingNotes: ['Nostalgic Pink Flesh', 'Delicate Floral Aroma', 'Balanced Mineral Salt', 'Deep Berry Notes'],
    fruitToneColor: '#D26466',
    isBestSeller: false
  },
  {
    id: 'prod-banana',
    slug: 'dried-banana',
    name: 'Dried Banana Chips',
    tagline: 'Naturally Sweet. Always a Classic.',
    description: 'Thinly cut slices of ripe South Indian Nendran bananas, slowly warm-air dried to a crisp snap. Zero palm oil, zero frying, and zero added sugar — purely the natural sweetness of ripe bananas.',
    price: 149,
    originalPrice: 189,
    rating: 5.0,
    reviewCount: 112,
    category: 'chips',
    netWeights: [
      { label: '40g', weightGrams: 40, priceMultiplier: 1 }
    ],
    defaultWeight: '40g',
    images: {
      main: '/assets/products/dried-banana.png',
      thumbnail: '/assets/products/dried-banana.png',
      gallery: [
        '/assets/products/dried-banana.png',
        '/assets/products/hero-dried-banana.jpg',
        'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80'
      ]
    },
    ingredients: '100% Naturally Dehydrated Nendran Bananas. Non-fried.',
    nutritionInfo: {
      servingSize: '40g',
      calories: '138 kcal',
      carbohydrates: '32g',
      naturalSugars: '18g',
      addedSugars: '0g',
      dietaryFiber: '2.8g',
      protein: '1.6g',
      fat: '0.4g'
    },
    storage: 'Store in a cool dry cabinet. Ensure pouch is tightly closed after opening to keep crunch.',
    shipping: 'Dispatched within 24 hours. Free delivery on orders above ₹499 across India.',
    tastingNotes: ['Satisfying Crisp Snap', 'Naturally Sweet', 'Rich Potassium', 'Zero Oil Feel'],
    fruitToneColor: '#DFB448',
    isBestSeller: false
  }
];

export const INITIAL_REVIEWS = {
  'prod-mango': [
    {
      id: 'rev-m-1',
      productId: 'prod-mango',
      customerName: 'Ananya S.',
      rating: 5,
      reviewDate: '2 weeks ago',
      reviewText: 'Absolutely loved the taste! Super fresh and healthy snack. Will definitely order again.',
      verifiedBuyer: true
    },
    {
      id: 'rev-m-2',
      productId: 'prod-mango',
      customerName: 'Rohan M.',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Perfect balance of sweetness and chew. Feels premium and natural.',
      verifiedBuyer: true
    },
    {
      id: 'rev-m-3',
      productId: 'prod-mango',
      customerName: 'Sneha P.',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Tastes just like real mangoes! My go-to healthy snack now.',
      verifiedBuyer: true
    }
  ],
  'prod-pineapple': [
    {
      id: 'rev-p-1',
      productId: 'prod-pineapple',
      customerName: 'Siddharth V.',
      rating: 5,
      reviewDate: '2 weeks ago',
      reviewText: 'Incredible balance of acidity and sweet caramelized pineapple notes. Most store-bought dried pineapples are soaked in sugar syrup, but this one is completely honest fruit.',
      verifiedBuyer: true
    },
    {
      id: 'rev-p-2',
      productId: 'prod-pineapple',
      customerName: 'Pooja Iyer',
      rating: 5,
      reviewDate: '3 weeks ago',
      reviewText: 'Great tangy kick! Perfect afternoon pick-me-up at my work desk. Arrived neatly packaged in 2 days.',
      verifiedBuyer: true
    },
    {
      id: 'rev-p-3',
      productId: 'prod-pineapple',
      customerName: 'Kavita Menon',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Super natural and intensely flavourful! You can taste the genuine sun-ripened pineapple sweetness.',
      verifiedBuyer: true
    }
  ],
  'prod-guava': [
    {
      id: 'rev-g-1',
      productId: 'prod-guava',
      customerName: 'Meera Nambiar',
      rating: 5,
      reviewDate: '1 week ago',
      reviewText: 'The pink guava with the slight touch of pink salt brought back childhood memories of street fruit carts. The aroma is heavenly when you open the pouch.',
      verifiedBuyer: true
    },
    {
      id: 'rev-g-2',
      productId: 'prod-guava',
      customerName: 'Arjun Sen',
      rating: 5,
      reviewDate: '3 weeks ago',
      reviewText: 'Hands down my favorite flavor from Zestora. The texture has a pleasant soft bite and the fiber makes it genuinely filling.',
      verifiedBuyer: true
    },
    {
      id: 'rev-g-3',
      productId: 'prod-guava',
      customerName: 'Tanvi Shah',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Incredible texture and wonderful aroma! The subtle mineral salt pinch elevates the natural guava tang perfectly.',
      verifiedBuyer: true
    }
  ],
  'prod-banana': [
    {
      id: 'rev-b-1',
      productId: 'prod-banana',
      customerName: 'Vikram Patel',
      rating: 5,
      reviewDate: '2 weeks ago',
      reviewText: 'Finally a banana chip that is NOT deep fried in heavy palm or coconut oil! Clean, crisp, and you taste the authentic Nendran banana sweetness.',
      verifiedBuyer: true
    },
    {
      id: 'rev-b-2',
      productId: 'prod-banana',
      customerName: 'Sunita Roy',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Very crunchy and light. Love having this with evening black tea. Great guilt-free snack.',
      verifiedBuyer: true
    },
    {
      id: 'rev-b-3',
      productId: 'prod-banana',
      customerName: 'Devansh Joshi',
      rating: 5,
      reviewDate: '1 month ago',
      reviewText: 'Non-greasy, wholesome, and delightfully snappy! Our whole family loves snacking on these.',
      verifiedBuyer: true
    }
  ]
};
