'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  LayoutDashboard,
  ChevronDown,
  Stethoscope,
  Users,
  MessageCircle,
  Info,
  Home,
  Mail,
  Heart
} from 'lucide-react';
import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import UserDropdown from '@/components/UserDropdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Stethoscope },
  { href: '/about', label: 'About', icon: Info },
  { href: '/staff', label: 'Our Staff', icon: Users },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/donate', label: 'Donate', icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user: clerkUser, isSignedIn } = useUser();

  // Get user with role information
  const userWithRole = useQuery(
    api.users.getCurrentUserWithRole,
    isSignedIn && clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      patient: 'Patient',
      admin: 'Admin',
      superadmin: 'Super Admin',
      doctor: 'Doctor',
      nurse: 'Nurse',
      allied_health: 'Allied Health',
      support_staff: 'Support Staff',
      administrative_staff: 'Admin Staff',
      technical_staff: 'Technical Staff',
      training_research_staff: 'Research Staff',
      editor: 'Editor',
    };
    return labels[role] || role;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Top Banner - Contact Info & Emergency */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Layout */}
          <div className="hidden lg:flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a 
                href="tel:+256787324041" 
                className="flex items-center gap-2 hover:text-brand-orange transition-colors group"
              >
                <Phone className="h-3.5 w-3.5 group-hover:animate-pulse" />
                <span>+256 787 324 041</span>
              </a>
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="h-3.5 w-3.5" />
                <span>Kayunga, Uganda</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="tel:+256708726924" 
                className="flex items-center gap-2 hover:text-brand-orange transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-300 font-medium">Emergency:</span>
                <span className="font-semibold">+256 708 726 924</span>
              </a>
            </div>
          </div>
          
          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden py-2 text-xs">
            <div className="flex items-center justify-between">
              <a href="tel:+256787324041" className="flex items-center gap-1.5 text-white/90">
                <Phone className="h-3 w-3" />
                <span className="truncate">+256 787 324 041</span>
              </a>
              <a 
                href="tel:+256708726924" 
                className="flex items-center gap-1.5 text-red-300 font-semibold"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="hidden xs:inline">Emergency:</span>
                <span>+256 708 726 924</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={cn(
        "bg-white/95 backdrop-blur-md transition-all duration-300",
        scrolled ? "shadow-lg" : "shadow-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo and Brand */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0 hover:opacity-90 transition-opacity group"
              onClick={handleLinkClick}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Suubi Medical Centre" 
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-brand-navy truncate">
                  Suubi Medical Centre
                </span>
                <span className="text-[10px] sm:text-xs lg:text-sm text-brand-teal hidden xs:block">
                  Caring for Your Health
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                    isActiveLink(link.href)
                      ? "text-brand-orange bg-brand-orange/10"
                      : "text-brand-navy hover:text-brand-orange hover:bg-brand-orange/5"
                  )}
                >
                  {link.label}
                  {isActiveLink(link.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-orange"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side - CTA & Auth */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Dashboard Link for signed-in users */}
              <SignedIn>
                {userWithRole && (
                  <Link href={userWithRole.dashboardPath}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-all"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden xl:inline">Dashboard</span>
                      <Badge 
                        variant="secondary" 
                        className="ml-1 text-[10px] px-1.5 py-0 bg-brand-teal/10 text-brand-teal hidden xl:inline-flex"
                      >
                        {getRoleLabel(userWithRole.role)}
                      </Badge>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <Link href="/appointments">
                <Button 
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-amber-500 hover:to-brand-orange text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </Button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    variant="outline"
                    className="border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserDropdown />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <SignedIn>
                <UserDropdown />
              </SignedIn>
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen 
                  ? <X className="h-6 w-6 text-brand-navy" /> 
                  : <Menu className="h-6 w-6 text-brand-navy" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "lg:hidden bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-[calc(100vh-120px)] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActiveLink(link.href)
                      ? "bg-brand-orange/10 text-brand-orange font-medium"
                      : "text-brand-navy hover:bg-gray-50"
                  )}
                  onClick={handleLinkClick}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
              {/* Dashboard Link for signed-in users on mobile */}
              <SignedIn>
                {userWithRole && (
                  <Link href={userWithRole.dashboardPath} onClick={handleLinkClick}>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>My Dashboard</span>
                      <Badge 
                        variant="secondary" 
                        className="ml-2 text-xs bg-brand-teal/10 text-brand-teal"
                      >
                        {getRoleLabel(userWithRole.role)}
                      </Badge>
                    </Button>
                  </Link>
                )}
              </SignedIn>

              <Link href="/appointments" onClick={handleLinkClick}>
                <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-amber-500 hover:from-amber-500 hover:to-brand-orange text-white shadow-md">
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </Button>
              </Link>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
