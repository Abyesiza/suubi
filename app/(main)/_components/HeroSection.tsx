'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  CalendarHeart, 
  ShieldCheck, 
  HeartPulse, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Trusted Care',
    description: 'Licensed professionals on every shift',
    color: 'from-brand-teal to-brand-eucalyptus'
  },
  {
    icon: HeartPulse,
    title: 'Families First',
    description: 'Thousands of families supported',
    color: 'from-brand-orange to-amber-500'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock care available',
    color: 'from-purple-500 to-indigo-500'
  }
];

const stats = [
  { value: '10K+', label: 'Patients Served' },
  { value: '50+', label: 'Medical Staff' },
  { value: '24/7', label: 'Available' },
  { value: '98%', label: 'Satisfaction' },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/hero.JPG', '/hero1.JPG'];
  const { isSignedIn } = useUser();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-brand-teal/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  variant="outline" 
                  className="mb-6 px-4 py-2 text-sm border-white/20 bg-white/5 text-white/90 backdrop-blur-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-brand-orange" />
                  Compassionate Healthcare for All
                </Badge>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                Quality Healthcare{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">
                  For Every Family
                </span>{' '}
                in Uganda
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Suubi Medical Centre, powered by Boost Health Initiative, provides 
                accessible, professional healthcare services. Book appointments online 
                or connect with our care team instantly.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              >
                <SignedIn>
                  <Link href="/appointments">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-brand-orange to-amber-500 hover:from-amber-500 hover:to-brand-orange text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <CalendarHeart className="w-5 h-5 mr-2" />
                      Book Appointment
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Talk to Us
                    </Button>
                  </Link>
                </SignedIn>

                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl="/appointments">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-brand-orange to-amber-500 hover:from-amber-500 hover:to-brand-orange text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <CalendarHeart className="w-5 h-5 mr-2" />
                      Book Appointment
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal" fallbackRedirectUrl="/chat">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Talk to Us
                    </Button>
                  </SignInButton>
                </SignedOut>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-lg">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-orange/30 via-brand-teal/20 to-purple-500/30 rounded-3xl blur-2xl opacity-60" />
                
                {/* Main image container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <div className="aspect-[4/5] relative">
                    {images.map((src, index) => (
                      <Image
                        key={src}
                        src={src}
                        alt="Suubi Medical Centre team providing care"
                        fill
                        priority={index === 0}
                        className={cn(
                          "object-cover transition-opacity duration-1000",
                          currentImageIndex === index ? "opacity-100" : "opacity-0"
                        )}
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    ))}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <p className="text-white font-semibold text-lg mb-1">
                        Compassionate Care
                      </p>
                      <p className="text-white/70 text-sm">
                        Our team is ready to support your health journey
                      </p>
                      
                      {/* Image indicators */}
                      <div className="flex gap-2 mt-4">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              currentImageIndex === index 
                                ? "w-8 bg-brand-orange" 
                                : "w-1.5 bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`View image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -right-4 top-1/4 hidden lg:block"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Online Now</p>
                        <p className="text-white/60 text-xs">Care team available</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 lg:mt-20"
          >
            {trustSignals.map(({ icon: Icon, title, description, color }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="group relative"
              >
                <div className="relative flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className={cn(
                    "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                    color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{title}</p>
                    <p className="text-white/60 text-sm">{description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
