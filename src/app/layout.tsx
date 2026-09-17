import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/common/Providers';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { AuthModal } from '@/components/common/AuthModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AURA STUDIO | Contemporary Men\'s Silhouette & Essentials',
  description:
    'Quiet luxury meets modern contemporary streetwear. 240 GSM heavyweight combed cotton, relaxed silhouettes, and architectural tailoring for everyday elevation.',
  keywords: [
    'contemporary mens fashion',
    'quiet luxury',
    'oversized heavy t-shirt',
    '240 gsm cotton',
    'pleated trousers',
    'modern streetwear india',
    'essential menswear',
  ],
  openGraph: {
    title: 'AURA STUDIO | Contemporary Men\'s Silhouette & Essentials',
    description: 'Everyday elevated essentials crafted with considered fits and heavyweight textiles.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F6F2] text-[#171717]">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
