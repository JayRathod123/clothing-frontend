export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  content: string[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'the-anatomy-of-240-gsm-heavyweight-cotton',
    title: 'The Architecture of Heavyweight Cotton: Why 240 GSM is the Streetwear Gold Standard',
    excerpt: 'Understanding fabric weight, yarn count, and why high-density French Terry cotton completely transforms the drape and longevity of modern silhouettes.',
    category: 'Textile Science',
    author: 'Kabir Varma',
    authorRole: 'Head of Product Architecture',
    publishedAt: 'September 12, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
    tags: ['Heavyweight Cotton', '240 GSM', 'Drape', 'Fabric Engineering'],
    content: [
      'In contemporary fashion and streetwear, fabric weight is no longer an afterthought—it is the foundation of silhouette. Most commercial high-street t-shirts are produced using 140 to 180 GSM (grams per square meter) fabrics. While lightweight, they frequently suffer from collar sagging, rapid structural loss after two washes, and an unflattering cling.',
      'At KINETIC // STUDIO, our benchmark begins at 240 GSM super combed ringspun French Terry cotton. This specific density provides the ideal rigidity required to achieve a true drop shoulder without feeling stiff or suffocating in warmer climates.',
      'Furthermore, our textiles undergo an intensive pre-shrinkage bio-wash process. Organic enzymes buff away microscopic fiber fuzz, creating a silk-touch surface that accepts high-density screen printing with razor-sharp definition.',
      'When you invest in heavyweight construction, you are investing in a piece that drapes with architectural intent. The collar stays crisp at 1.25" width, and the hem holds its square stance regardless of wear count.'
    ]
  },
  {
    id: 'post-2',
    slug: 'how-to-style-oversized-t-shirts-like-a-pro',
    title: 'Proportions & Silhouette: The Definitive Guide to Styling Oversized Tees',
    excerpt: 'Balance the boxy top with tailored bottoms, relaxed cargo pants, and structured footwear for an effortless high-contrast street look.',
    category: 'Style & Lookbook',
    author: 'Rhea Sen',
    authorRole: 'Senior Stylist',
    publishedAt: 'September 08, 2026',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
    tags: ['Styling Guide', 'Oversized Fit', 'Streetwear Proportions'],
    content: [
      'The mistake many make with oversized tees is simply buying three sizes up in a regular cut. A true oversized t-shirt is engineered with specific proportions: extended shoulders, wider chest width, and a calibrated length that does not swallow the torso.',
      'To style an oversized tee effectively, follow the rule of balance: pair a wide, relaxed upper block with single-pleated trousers or wide-leg denim that falls naturally over chunky footwear or clean retro sneakers.',
      'Layering is another key styling move. Throw an unbuttoned lightweight camp collar shirt or an open zip jacket over your tee to introduce subtle textural depth without adding bulk.'
    ]
  },
  {
    id: 'post-3',
    slug: 'care-guide-preserving-high-density-prints',
    title: 'Wash Care Decoded: How to Make Your Graphic Prints Last for Years',
    excerpt: 'Proven washing, drying, and ironing techniques to prevent print cracking, fiber pilling, and collar distortion over hundreds of wears.',
    category: 'Garment Care',
    author: 'Devika Nair',
    authorRole: 'Textile Conservator',
    publishedAt: 'August 29, 2026',
    readTime: '3 min read',
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
    tags: ['Care Guide', 'Wash Tips', 'Longevity'],
    content: [
      'High-density plastisol and silicon inks cure onto the fabric at elevated temperatures. However, harsh machine cycles and extreme heat during drying are the primary causes of graphic deterioration.',
      'Rule 1: Always invert your t-shirts inside-out prior to placing them in the drum. This reduces friction against other clothing zippers and prevents surface abrasion.',
      'Rule 2: Wash in cold water (30°C or below). Cold water preserves natural cotton fiber integrity and prevents thermal thermal stress on prints.',
      'Rule 3: Air dry in natural shade whenever possible. If using an electric dryer, select the delicate low-heat cycle. Never iron directly over printed artworks—always iron on the reverse side.'
    ]
  }
];
