'use client';

import Footer from '@/components/Landing/Footer';
import Header from '@/components/Landing/Header';
import ScrollToTop from '@/components/Landing/ScrollToTop';
import { Inter } from 'next/font/google';
import '@/styles/index.css';
import { Providers } from '../providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
      <Providers>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </Providers>
    </section>
  );
}
