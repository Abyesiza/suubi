'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/hero.JPG', '/hero1.JPG'];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1, delayChildren: 0.2 }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  } as const;

  return (
    <section className="relative min-h-screen flex flex-col justify-between text-white overflow-hidden md:mt-30">
      {/* Background Images with Fade Transition */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img}
            alt="Suubi Medical Centre"
            fill
            priority={index === 0}
            className="object-cover"
            quality={90}
          />
        </div>
      ))}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/85 via-[#1E3A5F]/75 to-[#2E8B57]/70 z-10"></div>


      <div className="flex-grow flex items-center justify-center">
        <div className="container-custom relative z-20 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main content */}
            <motion.div 
              variants={container} 
              initial="hidden" 
              animate="show"
            >

              <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-[1.1] text-white drop-shadow-lg">
                Bringing{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] to-[#FFA500]">
                  Hope Through Healthcare
                </span>
                {' '}to Uganda
              </motion.h1>

              <motion.p variants={item} className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
                Suubi Healthcare, an initiative of Boost Health Initiative (BHI), provides quality healthcare access to marginalized communities across Uganda, with special focus on women and children.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={item}
                className="relative grid grid-cols-2 sm:flex sm:flex-row gap-4 justify-center w-full max-w-md mx-auto mb-8"
              >
                <Link
                  href="/appointments"
                  aria-label="Book an appointment"
                  className="col-span-1 group"
                >
                  <button className="w-full bg-gradient-to-r from-[#F7941D] to-[#FF8C00] text-white hover:from-[#FF8C00] hover:to-[#F7941D] transition-all px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transform hover:scale-105 duration-200 hover:-translate-y-1">
                    Appointments
                  </button>
                </Link>
                <Link
                  href="/chat"
                  aria-label="Learn more about us"
                  className="col-span-1"
                >
                  <button className="w-full border-2 border-white/80 text-white hover:border-white hover:bg-white/10 transition-all px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm">
                    Chats
                  </button>
                </Link>
              </motion.div>

              {/* Image Navigation Dots */}
              <motion.div variants={item} className="flex justify-center gap-3 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'w-8 bg-[#F7941D]' 
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 