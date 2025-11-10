'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarHeart, ShieldCheck, HeartPulse, MessageCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['/hero.JPG', '/hero1.JPG'];
  const { isSignedIn } = useUser();

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const container = useMemo(
    () =>
      ({
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: 'easeOut',
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }) as const,
    []
  );

  const item = useMemo(
    () =>
      ({
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
      }) as const,
    []
  );

  const trustSignals = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: 'Trusted Care',
        description: 'Licensed clinicians on every shift'
      },
      {
        icon: HeartPulse,
        title: 'Families First',
        description: 'Thousands of women & children supported'
      },
      {
        icon: CalendarHeart,
        title: 'Same-Day Support',
        description: 'Live chat team helps secure your booking'
      }
    ],
    []
  );

  return (
    <section className="hero-shell">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="hero-glow" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-[#FFB347]/18 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white/6 blur-2xl" />
      </div>

      <div className="relative z-10 pt-28 sm:pt-36 lg:pt-44 pb-16 sm:pb-20 lg:pb-24">
        <div className="container-custom">
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-12 lg:gap-16">
            <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <motion.div
                variants={item}
                className="text-center lg:text-left space-y-6 lg:space-y-7 max-w-3xl mx-auto lg:mx-0 px-2 sm:px-0"
              >
                <div className="section-eyebrow">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#FFE082]" />
                  Caring support starts the moment you say hello
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] drop-shadow-lg">
                  Warm, Compassionate Care for Every Family in Uganda
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
                  Suubi Healthcare, powered by Boost Health Initiative, walks with you through each
                  step of your health journey. Reach out in real time and our care coordinators will
                  help schedule the right visit or put you in touch with the team you need.
                </p>

                <div className="space-y-6">
                  <div className="cta-stack">
                    <SignedIn>
                      <Link
                        href="/chat?intent=booking"
                        aria-label="Book an appointment"
                        className="flex-1 sm:flex-none"
                      >
                        <button className="cta-primary w-full sm:w-auto">
                          <CalendarHeart className="h-5 w-5" />
                          Book Now
                        </button>
                      </Link>
                      <Link
                        href="/chat"
                        aria-label="Talk to our care team in chat"
                        className="flex-1 sm:flex-none"
                      >
                        <button className="cta-secondary w-full sm:w-auto">
                          <MessageCircle className="h-5 w-5" />
                          Talk to Us
                        </button>
                      </Link>
                    </SignedIn>

                    <SignedOut>
                      <div className="cta-stack">
                        <SignInButton mode="modal" fallbackRedirectUrl="/chat?intent=booking">
                          <button className="cta-primary w-full sm:w-auto">
                            <CalendarHeart className="h-5 w-5" />
                            Book Now
                          </button>
                        </SignInButton>
                        <SignInButton mode="modal" fallbackRedirectUrl="/chat">
                          <button className="cta-secondary w-full sm:w-auto">
                            <MessageCircle className="h-5 w-5" />
                            Talk to Us
                          </button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                  </div>

                  <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto lg:mx-0">
                    {isSignedIn
                      ? 'Hop into chat and our care coordinators will lock in the appointment details with you in real time.'
                      : 'Create a free account in seconds—once you sign in, jump into chat and we will help secure the right visit immediately.'}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={item} className="w-full">
                <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg px-2 sm:px-0">
                  <div className="surface-card--glow relative overflow-hidden">
                    <div className="relative aspect-[4/5]">
                      <Image
                        src={images[currentImageIndex]}
                        alt="Suubi care team in action"
                        fill
                        priority
                        className="object-cover"
                        quality={90}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 520px"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-6 pb-6 pt-24">
                      <p className="text-lg font-semibold text-white drop-shadow">
                        Compassion in every conversation
                      </p>
                      <p className="text-sm text-white/80">
                        Our care team is online and ready to guide your next step.
                      </p>
                      <div className="flex justify-center gap-2 pt-1">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentImageIndex ? 'w-8 bg-[#FFB347]' : 'w-2 bg-white/60 hover:bg-white/90'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={item}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0"
            >
              {trustSignals.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB347]/80 to-[#FF8C42]/70 shadow-inner">
                    <Icon className="h-6 w-6 text-[#1F3C3A]" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/80">{description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}