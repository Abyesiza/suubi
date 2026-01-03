"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Staff", href: "/staff" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-brand-soft py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container-custom flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="Suubi Medical Centre"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-xl font-bold leading-tight font-heading transition-colors",
                                isScrolled ? "text-brand-navy" : "text-white"
                            )}>
                                Suubi
                            </span>
                            <span className={cn(
                                "text-xs font-medium tracking-wider uppercase transition-colors",
                                isScrolled ? "text-brand-teal" : "text-white/80"
                            )}>
                                Medical Centre
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-brand-orange relative group",
                                    pathname === link.href
                                        ? "text-brand-orange"
                                        : isScrolled
                                            ? "text-brand-navy"
                                            : "text-white/90"
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full",
                                    pathname === link.href ? "w-full" : ""
                                )} />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="tel:+256708726924"
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand-orange",
                                isScrolled ? "text-brand-navy" : "text-white"
                            )}
                        >
                            <Phone className="w-4 h-4" />
                            <span>Emergency</span>
                        </a>
                        <Button
                            asChild
                            className="rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold shadow-lg hover:shadow-brand-md transition-all duration-300"
                        >
                            <Link href="/booking">
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Now
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={cn(
                            "md:hidden p-2 rounded-full transition-colors",
                            isScrolled ? "text-brand-navy hover:bg-gray-100" : "text-white hover:bg-white/10"
                        )}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 pb-8 px-6 md:hidden flex flex-col gap-6 overflow-y-auto"
                    >
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-2xl font-semibold py-2 border-b border-gray-100",
                                        pathname === link.href ? "text-brand-orange" : "text-brand-navy"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto flex flex-col gap-4">
                            <Button
                                asChild
                                className="w-full rounded-xl py-6 text-lg bg-brand-orange hover:bg-brand-orange-dark text-white shadow-brand-md"
                            >
                                <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                                    Book Appointment
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
