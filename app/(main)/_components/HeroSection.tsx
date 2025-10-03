'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Shield } from 'lucide-react';

export default function HeroSection() {
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
    <section className="relative bg-gradient-to-br from-white via-[#F5F7F9] to-[#E8F5E9]/30 text-dark-purple overflow-hidden">
      {/* Wavy bottom edge */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-auto"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-background"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.71,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-background"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Decorative background shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#2E8B57]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F7941D]/5 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-20 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main content */}
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show"
          >

            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-[1.1] text-dark-purple">
              Bringing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E8B57] to-[#1E6F47]">
                Hope Through Healthcare
              </span>
              {' '}to Uganda
            </motion.h1>

            <motion.p variants={item} className="text-lg sm:text-xl lg:text-2xl text-dark-purple/70 mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto">
              Suubi Healthcare, an initiative of Boost Health Initiative (BHI), provides quality healthcare access to marginalized communities across Uganda, with special focus on women and children.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={item}
              className="relative grid grid-cols-2 sm:flex sm:flex-row gap-4 justify-center w-full max-w-md mx-auto"
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
                <button className="w-full border-2 border-dark-purple/20 text-dark-purple hover:border-dark-purple hover:bg-dark-purple/5 transition-all px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm">
                  Chats
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 