'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/images/hero/PDEU.jpeg', '/images/hero/PDEU2.jpeg', '/images/hero/PDEU4.jpg'];

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Dynamic Background Images with Fade Transition */}
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentImageIndex === index ? 1 : 0, zIndex: 0 }}
        >
          <Image
            src={src}
            alt={`Hero Background ${index + 1}`}
            layout="fill"
            objectFit="cover"
            priority={index === 0}
            className="z-0"
          />
        </div>
      ))}

      {/* Overlay with diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br bg-[#FAFAFA] opacity-30 dark:bg-gray-900 dark:opacity-50 z-1"></div>

      {/* Animated diagonal accent lines */}
      <div className="absolute inset-0 z-2 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 border-t-4 border-l-4 border-[#3045c9] animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-4 border-r-4 border-[#3045c9] animate-pulse"></div>
      </div>

      {/* Content Container with better positioning */}
      <section
        id="home"
        className="relative z-10 flex items-center justify-start h-full overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] text-white"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full md:w-3/5 px-4">
              <div className="mx-auto max-w-[1000px] bg-white/30 backdrop-blur-sm p-8 dark:bg-[#101238]/30 animate-slideInLeft">
                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white sm:text-4xl sm:leading-tight md:text-6xl md:leading-tight">
                  LEARN, GROW, SERVE: <br />
                  <span className="text-[#3045c9]">THE CSSI INTERNSHIP PORTAL</span>
                </h1>
                <p className="mb-8 font-semibold text-sm leading-relaxed text-[#101238] dark:text-white md:text-xl sm:text-xl">
                  A portal to simplify the internship journey, making it easier for students and faculty to manage the
                  process, striving towards a productive experience.
                </p>
                <div className="flex flex-row items-center space-x-4">
                  <Link
                    href="/about"
                    className="relative overflow-hidden rounded-none bg-[#3045c9] px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-[#2538a9] group"
                  >
                    <span className="relative z-10">Read More</span>
                    <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-20"></span>
                  </Link>
                  <Link
                    href="/signin"
                    className="relative overflow-hidden rounded-none border-2 border-primary bg-transparent px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-white/10 group"
                  >
                    <span className="relative z-10">Sign In</span>
                    <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-10"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated floating dots */}
      <div className="absolute bottom-10 right-10 animate-bounce w-4 h-4 bg-[#3045c9] z-10"></div>
      <div className="absolute bottom-20 right-20 animate-bounce delay-300 w-2 h-2 bg-white z-10"></div>
      <div className="absolute bottom-15 right-40 animate-bounce delay-700 w-3 h-3 bg-[#3045c9] z-10"></div>
    </div>
  );
};

// Add these animations to your global CSS or tailwind config
const globalStyles = `
@keyframes slideInLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideInLeft {
  animation: slideInLeft 0.8s ease-out forwards;
}
`;

export default Hero;
