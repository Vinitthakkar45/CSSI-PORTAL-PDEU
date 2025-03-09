'use client';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <nav className="bg-black text-foreground  font-[Geist,'Geist Placeholder',sans-serif] text-base">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            {/* <a href="/" className="text-foreground font-bold text-xl flex items-center"> */}
            <span className="bg-foreground text-black p-1 rounded mr-1">CSSI</span>
            <span>PDEU</span>
            {/* </a> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {/* <a href="#" className="text-foreground hover:text-white transition-colors">Support</a>
            <a href="#" className="text-foreground hover:text-white transition-colors">FAQ</a> */}
            </div>

            <div className="flex items-center space-x-4">
              {/* <a href="/signup"  */}
              {/* //    className="bg-[#00bbff] text-black px-4 py-2 rounded font-medium hover:opacity-90 transition-colors"> */}
              Get Started
              {/* </a> */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground hover:text-white">
              {/* {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />} */}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-700 mt-4">
            <div className="flex flex-col space-y-3 px-2">
              {/* <a href="#" className="text-foreground hover:text-white px-3 py-2">Sessions API</a>
            <a href="#" className="text-foreground hover:text-white px-3 py-2">Pricing</a>
            <a href="#" className="text-foreground hover:text-white px-3 py-2">Docs</a>
            <a href="#" className="text-foreground hover:text-white px-3 py-2">Careers</a>
            <a href="#" className="flex items-center space-x-2 text-foreground hover:text-white px-3 py-2">
              <span>3.8K</span>
            </a>
            <a href="/login" className="text-foreground hover:text-white px-3 py-2">Log In</a>
            <a href="/signup" 
               className="bg-[#00bbff] text-black px-3 py-2 rounded font-medium hover:opacity-90 mt-2 text-center">
              Get Started
            </a> */}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
