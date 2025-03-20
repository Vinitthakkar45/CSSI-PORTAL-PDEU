import AboutSectionOne from '@/components/Landing/About/AboutSectionOne';
import AboutSectionTwo from '@/components/Landing/About/AboutSectionTwo';
import Blog from '@/components/Landing/Blog';
import Brands from '@/components/Landing/Brands';
import ScrollUp from '@/components/Landing/Common/ScrollUp';
import Contact from '@/components/Landing/Contact';
import Features from '@/components/Landing/Features';
import Hero from '@/components/Landing/Hero';
import Pricing from '@/components/Landing/Pricing';
import Testimonials from '@/components/Landing/Testimonials';
// import Video from "@/components/Video";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Next.js Template for Startup and SaaS',
  description: 'This is Home for Startup Nextjs Template',
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      {/* <Brands /> */}
      {/* <AboutSectionOne /> */}
      {/* <AboutSectionTwo /> */}
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      {/* <Blog /> */}
      <Contact />
    </>
  );
}
