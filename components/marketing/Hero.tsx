"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Heart, ShieldCheck, Star, CalendarCheck, Users, Stethoscope, HeartPulse, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-navy">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-brand-teal/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-brand-orange/10 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Radial gradient overlay for consistency */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />

            {/* Large decorative Stethoscope icon */}
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
                <Stethoscope className="w-[500px] h-[500px] text-white" />
            </div>

            {/* Small decorative HeartPulse icon */}
            <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
                <HeartPulse className="w-32 h-32 text-white" />
            </div>

            {/* Animated Blob */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="absolute top-20 right-[-10%] w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none z-0"
            />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-teal bg-white/10 mb-6 border border-white/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                                </span>
                                Top-Rated Medical Centre in Uganda
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 font-heading"
                        >
                            Healthcare that <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-eucalyptus">Cares for You.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg"
                        >
                            Experience advanced medical care combined with a personal touch.
                            From routine checkups to 24/7 emergency services, Suubi Medical Centre
                            is your partner in health.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 mb-6"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-full px-8 py-7 text-lg shadow-brand-md hover:shadow-brand-lg transition-all hover:-translate-y-1"
                            >
                                <Link href="/booking">
                                    Book an Appointment
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 rounded-full px-8 py-7 text-lg bg-transparent"
                            >
                                <Link href="/doctors">
                                    Find a Doctor
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Quick Action Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap gap-4 mb-12"
                        >
                            <Link
                                href="/health-assessment"
                                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group"
                            >
                                <ClipboardCheck className="w-4 h-4 text-brand-teal" />
                                Check Your Health
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                            <span className="text-white/20">|</span>
                            <Link
                                href="/register-patient"
                                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group"
                            >
                                <Heart className="w-4 h-4 text-brand-orange" />
                                Register a Patient in Need
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8"
                        >
                            <div>
                                <p className="text-3xl font-bold text-white">15+</p>
                                <p className="text-sm font-medium text-gray-400 mt-1">Specialists</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">24/7</p>
                                <p className="text-sm font-medium text-gray-400 mt-1">Emergency</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">4.9</p>
                                <p className="text-sm font-medium text-gray-400 mt-1 flex items-center gap-1">
                                    User Rating <Star className="w-3 h-3 fill-brand-amber text-brand-amber" />
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative lg:h-[700px] flex items-center justify-center">
                        {/* Main Image Container with Custom Shape */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative w-full max-w-[550px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white/10 z-10"
                        >
                            <Image
                                src="/hero1.JPG"
                                alt="Suubi Medical Team"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Gradient overlay at bottom for text readability if needed, or nicer effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent pointer-events-none" />
                        </motion.div>

                        {/* Floating Card 1: Success/Recovery */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="absolute top-20 right-0 md:-right-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-brand-lg border border-white/10 z-20 flex items-center gap-3 animate-pulse-subtle"
                        >
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <p className="font-bold text-white">98%</p>
                                <p className="text-xs text-gray-300 font-medium">Patient Satisfaction</p>
                            </div>
                        </motion.div>

                        {/* Floating Card 2: Doctors */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute bottom-32 left-0 md:-left-12 bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-brand-lg border border-white/10 z-20 max-w-[200px]"
                        >
                            <div className="flex -space-x-3 mb-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-navy bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <Users className="w-5 h-5 text-gray-400" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-brand-navy bg-brand-orange text-white text-xs flex items-center justify-center">
                                    +12
                                </div>
                            </div>
                            <p className="font-bold text-white text-sm">Expert Team</p>
                            <p className="text-xs text-gray-300">Dedicated professionals ready to help.</p>
                        </motion.div>

                        {/* Floating Card 3: Appointment */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.6 }}
                            className="absolute bottom-10 right-10 bg-brand-teal/90 backdrop-blur-md p-4 rounded-2xl shadow-brand-lg border border-white/20 z-20 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">Easy Booking</p>
                                <p className="text-xs text-white/80">Online & Fast</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
