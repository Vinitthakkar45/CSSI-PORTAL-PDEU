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
            className="z-0 filter brightness-[0.85]"
          />
        </div>
      ))}

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#101238]/60 to-transparent dark:from-gray-900/70 dark:to-gray-900/30 z-1"></div>

      {/* Animated accent elements */}
      <div className="absolute inset-0 z-2 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 border-t-4 border-l-4 border-[#3045c9] animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-4 border-r-4 border-[#3045c9] animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-20 h-20 border-t-2 border-r-2 border-white/30 animate-pulse"></div>
      </div>

      {/* Content Container with improved positioning and styling */}
      <section
        id="home"
        className="relative z-10 flex items-center justify-start h-full overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] text-white"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full md:w-3/5 px-4">
              <div className="mx-auto max-w-[1000px] bg-white/10 backdrop-blur-md p-8 shadow-xl dark:bg-[#101238]/40 animate-slideInLeft">
                <h1 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  <span className="text-[#3045c9] dark:text-blue-400">CSSI</span> - Civic and Social Service Internship
                  Portal
                </h1>
                <p className="mb-8 font-medium text-sm leading-relaxed text-white/90 dark:text-white/90 md:text-xl sm:text-lg">
                  A comprehensive platform designed to simplify the internship journey, making it easier for students
                  and faculty to manage the process, striving towards a productive and impactful experience.
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/about"
                    className="relative overflow-hidden rounded-md bg-[#3045c9] px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-[#2538a9] group w-full sm:w-auto text-center"
                  >
                    <span className="relative z-10">Explore Features</span>
                    <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out opacity-20"></span>
                  </Link>
                  <Link
                    href="/signin"
                    className="relative overflow-hidden rounded-md border-2 border-white bg-transparent px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-white/10 group w-full sm:w-auto text-center"
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

      {/* Enhanced animated elements */}
      <div className="absolute bottom-10 right-10 animate-bounce w-4 h-4 bg-[#3045c9] z-10 rounded-full shadow-lg shadow-[#3045c9]/30"></div>
      <div className="absolute bottom-20 right-20 animate-bounce delay-300 w-2 h-2 bg-white z-10 rounded-full shadow-lg shadow-white/30"></div>
      <div className="absolute bottom-15 right-40 animate-bounce delay-700 w-3 h-3 bg-[#3045c9] z-10 rounded-full shadow-lg shadow-[#3045c9]/30"></div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10 hidden md:block">
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
