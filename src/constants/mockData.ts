import { Product } from '@/types/product.types';
import { Category } from '@/types/category.types';
import { Collection } from '@/types/collection.types';
import { Review } from '@/types/review.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Heavyweight cotton silhouettes with structured drop-shoulders and refined necklines.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 1,
    status: 'active',
    productCount: 14,
  },
  {
    id: 'cat-2',
    name: 'Shirts',
    slug: 'shirts',
    description: 'Textured overshirts, fluid camp collars, and tailored utilitarian button-downs.',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 2,
    status: 'active',
    productCount: 9,
  },
  {
    id: 'cat-3',
    name: 'Bottoms',
    slug: 'bottoms',
    description: 'Relaxed wide-leg trousers, single-pleat tailoring, and heavyweight utility bottoms.',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 3,
    status: 'active',
    productCount: 11,
  },
  {
    id: 'cat-4',
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Minimal zip jackets, structured chore coats, and cropped silhouettes.',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
    sortOrder: 4,
    status: 'active',
    productCount: 6,
  },
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'THE NEW DROP — 04',
    slug: 'the-new-drop',
    description: 'Considered proportions. 240 GSM combed cotton and raw tactile textures designed for modern cadence.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400&auto=format&fit=crop',
    isFeatured: true,
    status: 'active',
    sortOrder: 1,
  },
  {
    id: 'col-2',
    name: 'MONOCHROME STUDIO',
    slug: 'monochrome-studio',
    description: 'Deep chalk, vintage noir, and earthy mineral tones. A study in quiet minimalism.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop',
    isFeatured: true,
    status: 'active',
    sortOrder: 2,
  },
  {
    id: 'col-3',
    name: 'HEAVYWEIGHT COTTON 240 GSM',
    slug: 'heavyweight-cotton',
    description: 'Engineered density that drapes without clinging. The foundation of everyday elevation.',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1400&auto=format&fit=crop',
    isFeatured: false,
    status: 'active',
    sortOrder: 3,
  },
  {
    id: 'col-4',
    name: 'ARCHITECTURAL TAILORING',
    slug: 'architectural-tailoring',
    description: 'Contemporary fluid tailoring adapted for casual and editorial dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1400&auto=format&fit=crop',
    isFeatured: false,
    status: 'active',
    sortOrder: 4,
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'The Oversized Essential Tee',
    slug: 'oversized-essential-tee',
    description: 'Cut with an intentional drop shoulder and a structured high ribbed collar. Crafted from 240 GSM 100% combed ringspun cotton that holds a clean architectural silhouette without clinging. Finished with blind hem stitch detailing.',
    categoryId: 'cat-1',
    categoryName: 'T-Shirts',
    basePrice: 1699,
    discountPrice: 1299,
    sku: 'TEE-OVR-240-BLK',
    status: 'active',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 142,
    gsm: 240,
    fabric: '100% Combed Heavyweight Ringspun Cotton',
    fit: 'Boxy / Drop-Shoulder Relaxed Fit',
    details: [
      '240 GSM ultra-dense knit with zero transparency',
      '2.5cm tight-ribbed anti-stretch collar',
      'Twin-needle hem and sleeve finish',
      'Pre-shrunk to retain proportions across cold cycles',
      'Hand-finished in small batch studio run'
    ],
    careInstructions: [
      'Machine wash cold (30°C) with like colors',
      'Wash and iron inside out',
      'Do not tumble dry; dry flat in shade',
      'Warm iron if required'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-1-1', productId: 'prod-01', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-1-2', productId: 'prod-01', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
      { id: 'img-1-3', productId: 'prod-01', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 3 },
      { id: 'img-1-4', productId: 'prod-01', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 4 },
    ],
    variants: [
      { id: 'var-1-1', productId: 'prod-01', sku: 'TEE-OVR-BLK-S', size: 'S', color: 'Washed Black', colorHex: '#1F1F1F', price: 1299, discountPrice: null, stockQuantity: 24, isActive: true },
      { id: 'var-1-2', productId: 'prod-01', sku: 'TEE-OVR-BLK-M', size: 'M', color: 'Washed Black', colorHex: '#1F1F1F', price: 1299, discountPrice: null, stockQuantity: 40, isActive: true },
      { id: 'var-1-3', productId: 'prod-01', sku: 'TEE-OVR-BLK-L', size: 'L', color: 'Washed Black', colorHex: '#1F1F1F', price: 1299, discountPrice: null, stockQuantity: 32, isActive: true },
      { id: 'var-1-4', productId: 'prod-01', sku: 'TEE-OVR-BLK-XL', size: 'XL', color: 'Washed Black', colorHex: '#1F1F1F', price: 1299, discountPrice: null, stockQuantity: 18, isActive: true },
      { id: 'var-1-5', productId: 'prod-01', sku: 'TEE-OVR-WHT-S', size: 'S', color: 'Chalk Bone', colorHex: '#EAE6DF', price: 1299, discountPrice: null, stockQuantity: 20, isActive: true },
      { id: 'var-1-6', productId: 'prod-01', sku: 'TEE-OVR-WHT-M', size: 'M', color: 'Chalk Bone', colorHex: '#EAE6DF', price: 1299, discountPrice: null, stockQuantity: 35, isActive: true },
      { id: 'var-1-7', productId: 'prod-01', sku: 'TEE-OVR-WHT-L', size: 'L', color: 'Chalk Bone', colorHex: '#EAE6DF', price: 1299, discountPrice: null, stockQuantity: 25, isActive: true },
      { id: 'var-1-8', productId: 'prod-01', sku: 'TEE-OVR-TAU-M', size: 'M', color: 'Raw Umber', colorHex: '#78685A', price: 1299, discountPrice: null, stockQuantity: 15, isActive: true },
    ]
  },
  {
    id: 'prod-02',
    name: 'Structured Box Overshirt',
    slug: 'structured-box-overshirt',
    description: 'A heavyweight 320 GSM brushed cotton overshirt tailored with a contemporary square hem and clean hidden-placket detailing. Ideal worn unbuttoned over our essential tees or buttoned as modern outerwear.',
    categoryId: 'cat-2',
    categoryName: 'Shirts',
    basePrice: 2999,
    discountPrice: 2499,
    sku: 'SHT-OVR-320-CHA',
    status: 'active',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 88,
    gsm: 320,
    fabric: 'Heavy Brushed Cotton Cavalry Twill',
    fit: 'Square Boxy Overshirt Fit',
    details: [
      '320 GSM heavyweight twill with soft peach handfeel',
      'Dual chest envelope patch pockets',
      'Corozo nut buttons with laser engraved edge',
      'Relaxed dropped shoulder line',
      'Side seam split vent for effortless pocket access'
    ],
    careInstructions: [
      'Machine wash cold gentle cycle',
      'Do not bleach',
      'Line dry in shade',
      'Medium heat iron'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-2-1', productId: 'prod-02', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-2-2', productId: 'prod-02', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-2-1', productId: 'prod-02', sku: 'SHT-OVR-S', size: 'S', color: 'Charcoal Noir', colorHex: '#2B2B2B', price: 2499, discountPrice: null, stockQuantity: 12, isActive: true },
      { id: 'var-2-2', productId: 'prod-02', sku: 'SHT-OVR-M', size: 'M', color: 'Charcoal Noir', colorHex: '#2B2B2B', price: 2499, discountPrice: null, stockQuantity: 28, isActive: true },
      { id: 'var-2-3', productId: 'prod-02', sku: 'SHT-OVR-L', size: 'L', color: 'Charcoal Noir', colorHex: '#2B2B2B', price: 2499, discountPrice: null, stockQuantity: 20, isActive: true },
      { id: 'var-2-4', productId: 'prod-02', sku: 'SHT-OVR-OLV-M', size: 'M', color: 'Stone Olive', colorHex: '#4E5346', price: 2499, discountPrice: null, stockQuantity: 18, isActive: true },
    ]
  },
  {
    id: 'prod-03',
    name: 'Pleated Relaxed Trouser',
    slug: 'pleated-relaxed-trouser',
    description: 'Designed with a double forward pleat and an architectural straight-to-wide leg that falls cleanly over sneakers or derbies. Cut in a seasonless wool-blend twill that offers fluid drape and crease resistance.',
    categoryId: 'cat-3',
    categoryName: 'Bottoms',
    basePrice: 3499,
    discountPrice: 2899,
    sku: 'TRS-PLT-WOL-BLK',
    status: 'active',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 96,
    gsm: 280,
    fabric: 'Tencel & Merino Wool Blend Twill',
    fit: 'High-Rise Relaxed Wide-Leg',
    details: [
      'Twin forward knife pleats for generous movement',
      'Concealed elasticated internal waist tab for flex fit',
      'Side slant pockets and rear welt pockets',
      'Clean unhemmed interior with 2-inch let-out allowance',
      'Pre-creased permanent leg press'
    ],
    careInstructions: [
      'Dry clean or gentle hand wash cold',
      'Do not wring',
      'Hang dry away from direct heat'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-3-1', productId: 'prod-03', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-3-2', productId: 'prod-03', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-3-1', productId: 'prod-03', sku: 'TRS-PLT-30', size: '30', color: 'Deep Black', colorHex: '#141414', price: 2899, discountPrice: null, stockQuantity: 15, isActive: true },
      { id: 'var-3-2', productId: 'prod-03', sku: 'TRS-PLT-32', size: '32', color: 'Deep Black', colorHex: '#141414', price: 2899, discountPrice: null, stockQuantity: 30, isActive: true },
      { id: 'var-3-3', productId: 'prod-03', sku: 'TRS-PLT-34', size: '34', color: 'Deep Black', colorHex: '#141414', price: 2899, discountPrice: null, stockQuantity: 22, isActive: true },
      { id: 'var-3-4', productId: 'prod-03', sku: 'TRS-PLT-KHK-32', size: '32', color: 'Muted Khaki', colorHex: '#8C8578', price: 2899, discountPrice: null, stockQuantity: 16, isActive: true },
    ]
  },
  {
    id: 'prod-04',
    name: 'Heavyweight Boxy Hoodie',
    slug: 'heavyweight-boxy-hoodie',
    description: 'Constructed from a custom-developed 450 GSM diagonal-loop French terry. Featuring a double-layered structured hood with zero drawstrings for an uninterrupted, minimal neckline. Wide ribbed cuffs and hem.',
    categoryId: 'cat-1',
    categoryName: 'T-Shirts',
    basePrice: 3999,
    discountPrice: 3499,
    sku: 'HD-BOX-450-SLT',
    status: 'active',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 110,
    gsm: 450,
    fabric: '100% Cotton Heavyweight Loopback French Terry',
    fit: 'Boxy / Drop Shoulder Silhouette',
    details: [
      'Substantial 450 GSM density for structural drape',
      'Dual-ply crossover hood without drawcords',
      'Hidden in-seam side hand pockets',
      'Vintage enzyme wash for subtle patina',
      'Ribbed stretch side gussets for movement'
    ],
    careInstructions: [
      'Machine wash cold with gentle detergent',
      'Lay flat to dry to maintain shape',
      'Do not bleach or dry clean'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-4-1', productId: 'prod-04', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-4-2', productId: 'prod-04', url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-4-1', productId: 'prod-04', sku: 'HD-BOX-S', size: 'S', color: 'Washed Slate', colorHex: '#4A5056', price: 3499, discountPrice: null, stockQuantity: 10, isActive: true },
      { id: 'var-4-2', productId: 'prod-04', sku: 'HD-BOX-M', size: 'M', color: 'Washed Slate', colorHex: '#4A5056', price: 3499, discountPrice: null, stockQuantity: 25, isActive: true },
      { id: 'var-4-3', productId: 'prod-04', sku: 'HD-BOX-L', size: 'L', color: 'Washed Slate', colorHex: '#4A5056', price: 3499, discountPrice: null, stockQuantity: 20, isActive: true },
      { id: 'var-4-4', productId: 'prod-04', sku: 'HD-BOX-WHT-M', size: 'M', color: 'Chalk White', colorHex: '#ECE9E2', price: 3499, discountPrice: null, stockQuantity: 15, isActive: true },
    ]
  },
  {
    id: 'prod-05',
    name: 'Linen-Blend Camp Collar Shirt',
    slug: 'linen-camp-collar-shirt',
    description: 'An easy, fluid silhouette cut in a breathable Portuguese linen-tencel blend. Features an open Cuban notch collar, straight hem, and relaxed half sleeves. The ultimate lightweight summer layering essential.',
    categoryId: 'cat-2',
    categoryName: 'Shirts',
    basePrice: 2499,
    discountPrice: 1999,
    sku: 'SHT-CMP-LIN-ECR',
    status: 'active',
    isFeatured: true,
    rating: 4.7,
    reviewCount: 64,
    gsm: 190,
    fabric: '55% French Linen, 45% Lyocell Tencel',
    fit: 'Relaxed Vacation Fit',
    details: [
      'Unstructured spread camp collar',
      'Breathable slub linen texture',
      'Chalk composite tonal buttons',
      'Side slit vents for relaxed overhang'
    ],
    careInstructions: [
      'Cold gentle machine wash',
      'Hang dry immediately',
      'Warm steam iron'
    ],
    primaryImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-5-1', productId: 'prod-05', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-5-2', productId: 'prod-05', url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-5-1', productId: 'prod-05', sku: 'SHT-CMP-M', size: 'M', color: 'Raw Ecru', colorHex: '#F0EBE1', price: 1999, discountPrice: null, stockQuantity: 20, isActive: true },
      { id: 'var-5-2', productId: 'prod-05', sku: 'SHT-CMP-L', size: 'L', color: 'Raw Ecru', colorHex: '#F0EBE1', price: 1999, discountPrice: null, stockQuantity: 18, isActive: true },
      { id: 'var-5-3', productId: 'prod-05', sku: 'SHT-CMP-NVY-M', size: 'M', color: 'Deep Navy', colorHex: '#1B2430', price: 1999, discountPrice: null, stockQuantity: 14, isActive: true },
    ]
  },
  {
    id: 'prod-06',
    name: 'Architectural Wide-Leg Chino',
    slug: 'architectural-wide-leg-chino',
    description: 'Tailored from crisp 100% compact cotton gabardine with clean straight cut lines. Minimalist internal waist adjuster and tailored welt pockets create an uncluttered profile suited for both casual and elevated styling.',
    categoryId: 'cat-3',
    categoryName: 'Bottoms',
    basePrice: 3199,
    discountPrice: 2699,
    sku: 'CHN-WID-GAB-TAU',
    status: 'active',
    isFeatured: false,
    rating: 4.8,
    reviewCount: 52,
    gsm: 290,
    fabric: '100% Compact Cotton Gabardine',
    fit: 'Straight Wide Cut',
    details: [
      'Dense 290 GSM gabardine weave with clean drape',
      'Reinforced bar-tacking on stress points',
      'YKK brass zip fly with horn button closure',
      'Internal cotton pocketing'
    ],
    careInstructions: ['Machine wash cold inside out', 'Tumble dry low or line dry'],
    primaryImage: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-6-1', productId: 'prod-06', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-6-2', productId: 'prod-06', url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-6-1', productId: 'prod-06', sku: 'CHN-WID-30', size: '30', color: 'Earthy Taupe', colorHex: '#9E9282', price: 2699, discountPrice: null, stockQuantity: 18, isActive: true },
      { id: 'var-6-2', productId: 'prod-06', sku: 'CHN-WID-32', size: '32', color: 'Earthy Taupe', colorHex: '#9E9282', price: 2699, discountPrice: null, stockQuantity: 26, isActive: true },
      { id: 'var-6-3', productId: 'prod-06', sku: 'CHN-WID-34', size: '34', color: 'Earthy Taupe', colorHex: '#9E9282', price: 2699, discountPrice: null, stockQuantity: 14, isActive: true },
    ]
  },
  {
    id: 'prod-07',
    name: 'Minimal Zip Chore Jacket',
    slug: 'minimal-zip-chore-jacket',
    description: 'An architectural re-imagining of the utilitarian chore jacket. Finished with a clean matte gunmetal two-way zipper, minimal point collar, and seamless front patch pockets. Cut from robust 12oz duck canvas.',
    categoryId: 'cat-4',
    categoryName: 'Outerwear',
    basePrice: 4499,
    discountPrice: 3899,
    sku: 'JKT-CHR-CNV-OLV',
    status: 'active',
    isFeatured: true,
    rating: 5.0,
    reviewCount: 39,
    gsm: 380,
    fabric: '12oz Heavy Organic Duck Canvas',
    fit: 'Slightly Cropped Boxy Cut',
    details: [
      'Two-way matte gunmetal zipper for versatile styling',
      'Dual large concealed entry waist pockets',
      'Interior zip chest security pocket',
      'Unlined body with clean bound seams'
    ],
    careInstructions: ['Spot clean or dry clean recommended', 'Cold gentle wash if necessary'],
    primaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-7-1', productId: 'prod-07', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-7-2', productId: 'prod-07', url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-7-1', productId: 'prod-07', sku: 'JKT-CHR-M', size: 'M', color: 'Washed Olive', colorHex: '#474D3F', price: 3899, discountPrice: null, stockQuantity: 12, isActive: true },
      { id: 'var-7-2', productId: 'prod-07', sku: 'JKT-CHR-L', size: 'L', color: 'Washed Olive', colorHex: '#474D3F', price: 3899, discountPrice: null, stockQuantity: 16, isActive: true },
      { id: 'var-7-3', productId: 'prod-07', sku: 'JKT-CHR-BLK-M', size: 'M', color: 'Noir Black', colorHex: '#181818', price: 3899, discountPrice: null, stockQuantity: 15, isActive: true },
    ]
  },
  {
    id: 'prod-08',
    name: 'Textured Waffle Knit Tee',
    slug: 'textured-waffle-knit-tee',
    description: 'Crafted with a micro thermal honeycomb knit in 260 GSM combed cotton. Adds tactile depth to minimal outfits with breathable texture and an easy relaxed drape.',
    categoryId: 'cat-1',
    categoryName: 'T-Shirts',
    basePrice: 1899,
    discountPrice: 1499,
    sku: 'TEE-WFL-260-STN',
    status: 'active',
    isFeatured: false,
    rating: 4.8,
    reviewCount: 47,
    gsm: 260,
    fabric: '100% Combed Thermal Cotton',
    fit: 'Relaxed Fit',
    details: [
      'Micro honeycomb waffle stitch for rich tactile surface',
      'Smooth 1x1 rib collar',
      'Split side vents',
      'Breathable open weave'
    ],
    careInstructions: ['Machine wash cold gentle', 'Reshape while damp', 'Dry flat'],
    primaryImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-8-1', productId: 'prod-08', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', isPrimary: true, sortOrder: 1 },
      { id: 'img-8-2', productId: 'prod-08', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop', isPrimary: false, sortOrder: 2 },
    ],
    variants: [
      { id: 'var-8-1', productId: 'prod-08', sku: 'TEE-WFL-S', size: 'S', color: 'Stone Grey', colorHex: '#9E9D99', price: 1499, discountPrice: null, stockQuantity: 14, isActive: true },
      { id: 'var-8-2', productId: 'prod-08', sku: 'TEE-WFL-M', size: 'M', color: 'Stone Grey', colorHex: '#9E9D99', price: 1499, discountPrice: null, stockQuantity: 28, isActive: true },
      { id: 'var-8-3', productId: 'prod-08', sku: 'TEE-WFL-L', size: 'L', color: 'Stone Grey', colorHex: '#9E9D99', price: 1499, discountPrice: null, stockQuantity: 20, isActive: true },
    ]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-01',
    customerName: 'Aarav Mehta',
    rating: 5,
    title: 'The neckline retention is unmatched',
    comment: 'I own tees from multiple international brands at 3x the price. The 240 GSM weight on this holds its architectural drop shoulder even after 15 washes. The tight ribbed collar doesn’t bacon or roll down.',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-08-14T10:00:00Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-01',
    customerName: 'Vikramaditya S.',
    rating: 5,
    title: 'Pure quiet luxury aesthetic',
    comment: 'Subtle proportions, thick fabric without feeling suffocating, and true washed black colorway. Definitely ordering more in bone and taupe.',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-08-28T14:20:00Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-02',
    customerName: 'Devansh K.',
    rating: 5,
    title: 'Exceptional cut and handfeel',
    comment: 'The boxy cut layers perfectly over the 240 GSM tee. The concealed placket makes it look like a high-end runway piece. Absolutely stunning attention to detail.',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: '2026-09-02T16:45:00Z',
  }
];

export const SHOP_THE_LOOK_DATA = {
  image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
  title: 'LOOK 01 — THE MONOCHROME UNIFORM',
  subtitle: 'A harmonious study in tonal layering and considered proportions.',
  hotspots: [
    {
      id: 'hotspot-1',
      productId: 'prod-02',
      productName: 'Structured Box Overshirt',
      price: 2499,
      category: 'Overshirt',
      color: 'Charcoal Noir',
      x: 48, // % from left
      y: 36, // % from top
    },
    {
      id: 'hotspot-2',
      productId: 'prod-01',
      productName: 'The Oversized Essential Tee',
      price: 1299,
      category: 'T-Shirt',
      color: 'Chalk Bone',
      x: 52,
      y: 49,
    },
    {
      id: 'hotspot-3',
      productId: 'prod-03',
      productName: 'Pleated Relaxed Trouser',
      price: 2899,
      category: 'Bottoms',
      color: 'Deep Black',
      x: 55,
      y: 72,
    }
  ]
};

export const SOCIAL_PROOF_GALLERY = [
  {
    id: 'sp-1',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
    author: '@kabir_design',
    location: 'Mumbai'
  },
  {
    id: 'sp-2',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    author: '@rohan_studio',
    location: 'Bangalore'
  },
  {
    id: 'sp-3',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    author: '@samir.v',
    location: 'New Delhi'
  },
  {
    id: 'sp-4',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    author: '@aditya.arch',
    location: 'London'
  }
];
