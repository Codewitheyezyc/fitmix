import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Fitmix. — Your closet. Everyone’s creativity.',
  description: 'The collaborative social fashion remixing platform. Post clothing pieces, combine community wardrobes into flat-lay outfit collages, and learn styling naturally.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fitmix',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,800;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-[#F8F9FA] transition-colors duration-300">
        <StoreProvider>
          <div className="flex flex-col min-h-screen relative selection:bg-[#E2FF66] selection:text-[#0D0E12]">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-8 pt-16">
              {children}
            </main>
            <BottomNav />
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
