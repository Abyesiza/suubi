'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import UserDropdown from '@/components/UserDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Banner - Contact Info & Emergency */}
      <div className="bg-dark-purple text-white px-4 py-2">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+256 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Emergency:</span>
              <span className="font-semibold">+256 987 654 321</span>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="md:hidden space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+256 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Kampala, Uganda</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>Emergency:</span>
              <span className="font-semibold">+256 987 654 321</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="Suubi Medical Centre" width={60} height={60} />

              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold text-dark-purple">Suubi Medical Centre</span>
                <span className="text-xs md:text-sm text-suubi-green">Caring for Your Health</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                Home
              </Link>
              <Link href="/services" className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                Services
              </Link>
              <Link href="/about" className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                About
              </Link>
              <Link href="/doctors" className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                Doctors
              </Link>
              <Link href="/contact" className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                Contact
              </Link>
            </div>

            {/* Right Side - Book Appointment Button & Auth */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/appointments">
                <button className="bg-mustard text-white hover:bg-orange-600 transition-colors px-6 py-3 rounded-lg font-medium">
                  Book Appointment
                </button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-dark-purple hover:text-suubi-green transition-colors font-medium">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserDropdown />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden" 
              onClick={() => setIsOpen(!isOpen)}
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
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block py-2 text-dark-purple hover:text-suubi-green transition-colors font-medium">
              Home
            </Link>
            <Link href="/services" className="block py-2 text-dark-purple hover:text-suubi-green transition-colors font-medium">
              Services
            </Link>
            <Link href="/about" className="block py-2 text-dark-purple hover:text-suubi-green transition-colors font-medium">
              About
            </Link>
            <Link href="/doctors" className="block py-2 text-dark-purple hover:text-suubi-green transition-colors font-medium">
              Doctors
            </Link>
            <Link href="/contact" className="block py-2 text-dark-purple hover:text-suubi-green transition-colors font-medium">
              Contact
            </Link>
            
            <div className="pt-4 border-t border-gray-200">
              <Link href="/appointments">
                <button className="w-full bg-mustard text-white hover:bg-orange-600 transition-colors py-3 rounded-lg font-medium mb-4">
                  Book Appointment
                </button>
              </Link>
              
              <div className="space-y-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full text-dark-purple hover:text-suubi-green transition-colors font-medium py-2">
                      Sign in
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserDropdown />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}