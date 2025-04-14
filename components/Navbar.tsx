'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, Calendar, User, Home, Layers, Info, DollarSign } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to detect when to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav 
        className={`w-full max-w-6xl rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-sm shadow-lg py-1' 
            : 'bg-white/30 backdrop-blur-sm py-2'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-mustard" />
              <span className="text-xl font-bold text-dark-purple">Suubi Healthcare</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="/" 
                icon={<Home className="w-5 h-5" />} 
                text="Home"
                scrolled={scrolled}
              />
              <NavLink href="/services" 
                icon={<Layers className="w-5 h-5" />} 
                text="Services"
                scrolled={scrolled}
              />
              <NavLink href="/doctors" 
                icon={<User className="w-5 h-5" />} 
                text="Doctors"
                scrolled={scrolled}
              />
              <NavLink href="/appointments" 
                icon={<Calendar className="w-5 h-5" />} 
                text="Appointments"
                scrolled={scrolled}
              />
              <NavLink href="/about" 
                icon={<Info className="w-5 h-5" />} 
                text="About"
                scrolled={scrolled}
              />
              <NavLink href="/donate" 
                icon={<DollarSign className="w-5 h-5" />} 
                text="Donate"
                scrolled={scrolled}
              />
              <Link href="/contact">
                <button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors px-5 py-2 rounded-full">
                  Connect With Us
                </button>
              </Link>
            </div>

            {/* Mobile Navigation Button */}
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
      </nav>
      
      {/* Mobile Navigation Menu - Positioned below the navbar */}
      {isOpen && (
        <div className="absolute top-24 left-0 right-0 md:hidden flex justify-center px-4">
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 flex flex-col space-y-4">
            <MobileNavLink href="/" text="Home" />
            <MobileNavLink href="/services" text="Services" />
            <MobileNavLink href="/doctors" text="Doctors" />
            <MobileNavLink href="/appointments" text="Appointments" />
            <MobileNavLink href="/about" text="About" />
            <MobileNavLink href="/donate" text="Donate" />
            <Link href="/contact">
              <button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors w-full text-center py-2 rounded-lg">Connect With Us</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, icon, text, scrolled }: { href: string; icon: React.ReactNode; text: string; scrolled: boolean }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-1 text-dark-purple hover:text-mustard transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}

function MobileNavLink({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="block px-4 py-2 text-dark-purple hover:text-mustard">
      {text}
    </Link>
  );
}