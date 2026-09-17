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
import { THEME } from '@/constants/theme';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${THEME.store.name} | Heavyweight 240 GSM Streetwear Silhouettes`,
  description:
    'Premium Indian streetwear brand. 240 GSM French Terry heavyweight cotton, oversized drop-shoulder fits, and architectural staples built for everyday confidence.',
  keywords: [
    'streetwear india',
    'oversized t-shirts',
    '240 gsm cotton',
    'heavyweight t-shirts',
    'graphic tees india',
    'french terry tees',
    'urban fashion',
    'kinetic studio',
    'inkstyles alternative',
  ],
  openGraph: {
    title: `${THEME.store.name} | Heavyweight Streetwear Drops`,
    description: 'Everyday elevated streetwear engineered in 240 GSM combed cotton with architectural boxy drape.',
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
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans selection:bg-black selection:text-white">
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
