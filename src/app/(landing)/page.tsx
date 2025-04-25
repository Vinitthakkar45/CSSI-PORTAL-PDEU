import ScrollUp from '@/components/Landing/Common/ScrollUp';
import Contact from '@/components/Landing/Contact';
import Features from '@/components/Landing/Features';
import Hero from '@/components/Landing/Hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDEU CSSI',
  description: 'This is Home for the PDEU CSSI PORTAL',
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Contact />
    </>
  );
}
