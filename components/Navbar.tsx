'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, MapPin, Calendar } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import UserDropdown from '@/components/UserDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Banner - Contact Info & Emergency */}
      <div className="bg-gradient-to-r from-[#1E3A5F] to-[#2E4A6F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+256787324041" className="flex items-center gap-2 hover:text-orange-300 transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>+256 787 324 041</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                <span>Kayunga, Uganda</span>
              </div>
            </div>
            <a href="tel:+256708726924" className="flex items-center gap-2 hover:text-orange-300 transition-colors">
              <span className="text-orange-300">Emergency:</span>
              <span className="font-semibold">+256 708 726 924</span>
            </a>
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden py-2 text-xs">
            <div className="flex items-center justify-between">
              <a href="tel:+256787324041" className="flex items-center gap-1.5">
                <Phone className="h-3 w-3" />
                <span className="truncate">+256 787 324 041</span>
              </a>
              <a href="tel:+256708726924" className="flex items-center gap-1.5 text-orange-300 font-semibold">
                <span className="hidden xs:inline">Emergency:</span>
                <span>+256 708 726 924</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo and Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-90 transition-opacity"
              onClick={handleLinkClick}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Suubi Medical Centre" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-dark-purple truncate">
                  Suubi Medical Centre
                </span>
                <span className="text-[10px] sm:text-xs lg:text-sm text-suubi-green hidden xs:block">
                  Caring for Your Health
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link 
                href="/" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/services" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/about" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/staff" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                Our Staff
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/chat" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                Chat
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
              <Link 
                href="/contact" 
                className="text-dark-purple hover:text-[#F7941D] transition-colors font-medium text-sm relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F7941D] transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right Side - CTA & Auth */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/appointments">
                <button className="flex items-center gap-2 bg-gradient-to-r from-[#F7941D] to-[#FF8C00] text-white hover:from-[#FF8C00] hover:to-[#F7941D] transition-all px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 duration-200">
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 border-2 border-dark-purple text-dark-purple hover:bg-dark-purple hover:text-white transition-all rounded-lg font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserDropdown />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen 
                ? <X className="h-6 w-6 text-dark-purple" /> 
                : <Menu className="h-6 w-6 text-dark-purple" />
              }
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`lg:hidden bg-white border-t border-gray-200 shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-4 space-y-1">
            <Link 
              href="/" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              Services
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link 
              href="/staff" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              Our Staff
            </Link>
            <Link 
              href="/chat" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              Chat
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-dark-purple hover:bg-orange-50 hover:text-[#F7941D] transition-colors font-medium rounded-lg"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
            
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
              <Link href="/appointments" onClick={handleLinkClick}>
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7941D] to-[#FF8C00] text-white hover:from-[#FF8C00] hover:to-[#F7941D] transition-all py-3 rounded-lg font-medium shadow-md">
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full border-2 border-dark-purple text-dark-purple hover:bg-dark-purple hover:text-white transition-all py-3 rounded-lg font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="px-4">
                  <UserDropdown />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}