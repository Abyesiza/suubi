'use client';

import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Link from 'next/link';
import Image from 'next/image';
import Lifeline from '@/components/ui/Lifeline';
import { motion } from 'framer-motion';
import { Users, Activity, GraduationCap, ArrowRight, ArrowUpRight } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function HeroSection() {
  const container = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.08, delayChildren: 0.1 }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  } as const;

  const statsContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  } as const;

  const statItem = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  } as const;

  return (
    <section className="relative bg-gradient-to-br from-background via-light-gray to-teal-tint/20 text-dark-purple overflow-hidden">
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

      <div className="container-custom relative z-20 pt-32 md:pt-36 lg:pt-40 pb-8 md:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Main content */}
          <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl order-2 lg:order-1">
            <motion.h1 variants={item} className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight text-dark-purple text-center lg:text-left">
              Discover the Comprehensive Care You Deserve
            </motion.h1>

            <motion.p variants={item} className="text-base md:text-lg lg:text-xl text-dark-purple/80 mb-6 md:mb-8 leading-relaxed text-center lg:text-left">
              Our healthcare center is designed to help you find the right healthcare solution for you and your family, all in one convenient location.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mb-6 md:mb-8 justify-center lg:justify-start">
              <Link href="/appointments" aria-label="Book an appointment">
                <button className="bg-mustard text-white hover:bg-orange-600 transition-colors px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg flex items-center gap-2">
                  Book Appointment
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </Link>
            </motion.div>

          </motion.div>

          {/* Right side - Healthcare Team Images with background shape */}
          <motion.div variants={statsContainer} className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            <motion.div variants={statItem} className="relative">
              {/* Background blob shape */}
              <div className="absolute inset-0 bg-light-gray/80 rounded-full transform scale-110 md:scale-125 lg:scale-150 blur-sm"></div>
              <div className="relative bg-white rounded-full p-4 md:p-6 lg:p-8 transform scale-100 md:scale-110 lg:scale-125 shadow-lg">
                {/* Healthcare Team Images Container */}
                <div className="w-full h-60 md:h-72 lg:h-80 relative flex items-center justify-center">
                  {/* Doctor (dr2.png) */}
                  <div className="absolute left-2 md:left-4 top-4 md:top-8 transform -rotate-6 md:-rotate-12">
                    <div className="relative">
                      <Image 
                        src="/img/dr2.png" 
                        alt="Doctor" 
                        width={80}
                        height={120}
                        className="md:w-[100px] md:h-[140px] lg:w-[120px] lg:h-[160px] rounded-lg shadow-lg"
                      />
                      {/* Doctor label overlay */}
                      <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-suubi-green text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Doctor
                      </div>
                    </div>
                  </div>
                  
                  {/* Specialist (dr3.png) */}
                  <div className="absolute right-2 md:right-4 top-4 md:top-8 transform rotate-6 md:rotate-12">
                    <div className="relative">
                      <Image 
                        src="/img/dr3.png" 
                        alt="Specialist" 
                        width={80}
                        height={120}
                        className="md:w-[100px] md:h-[140px] lg:w-[120px] lg:h-[160px] rounded-lg shadow-lg"
                      />
                      {/* Specialist label overlay */}
                      <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-mustard text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Specialist
                      </div>
                    </div>
                  </div>
                  
                  {/* Nurse 1 (dr5.png) */}
                  <div className="absolute left-4 md:left-8 bottom-4 md:bottom-8 transform -rotate-3 md:-rotate-6">
                    <div className="relative">
                      <Image 
                        src="/img/dr5.png" 
                        alt="Nurse" 
                        width={70}
                        height={100}
                        className="md:w-[80px] md:h-[110px] lg:w-[100px] lg:h-[140px] rounded-lg shadow-lg"
                      />
                      {/* Nurse label overlay */}
                      <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-suubi-green text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Nurse
                      </div>
                    </div>
                  </div>
                  
                  {/* Nurse 2 (dr6.png) */}
                  <div className="absolute right-4 md:right-8 bottom-4 md:bottom-8 transform rotate-3 md:rotate-6">
                    <div className="relative">
                      <Image 
                        src="/img/dr6.png" 
                        alt="Nurse" 
                        width={70}
                        height={100}
                        className="md:w-[80px] md:h-[110px] lg:w-[100px] lg:h-[140px] rounded-lg shadow-lg"
                      />
                      {/* Nurse label overlay */}
                      <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 bg-suubi-green text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium shadow-md">
                        Nurse
                      </div>
                    </div>
                  </div>
                  
                  {/* Center text */}
                  <div className="text-center text-dark-purple z-10">
                    <Users className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 mx-auto mb-2 md:mb-3 text-suubi-green" />
                    <p className="text-base md:text-lg font-semibold">Healthcare Team</p>
                    <p className="text-xs md:text-sm text-dark-purple/70">Ready to serve you</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 