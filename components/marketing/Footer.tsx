"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-navy pt-20 pb-10 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-12 h-12">
                                <Image
                                    src="/logo.png"
                                    alt="Suubi Medical Centre"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold font-heading">Suubi Medical</span>
                        </Link>
                        <p className="text-gray-300 leading-relaxed">
                            Providing world-class healthcare with dignity and compassion. We are committed to improving community health through accessible and high-quality medical services.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-brand-teal transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-brand-teal transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-brand-teal transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-brand-teal transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-brand-orange">Quick Links</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Our Doctors', 'Services', 'Book Appointment', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase().replace(' ', '-') === 'home' ? '' : item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-300 hover:text-white hover:translate-x-2 transition-all inline-block"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-brand-orange">Our Services</h3>
                        <ul className="space-y-4">
                            {['General Consultation', 'Maternal Health', 'Dental Care', 'Laboratory', 'Surgery'].map((item) => (
                                <li key={item}>
                                    <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-brand-orange">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3 text-gray-300">
                                <MapPin className="w-5 h-5 text-brand-teal shrink-0 mt-1" />
                                <span>Level 1 Ssebowa House,<br />Kayunga, Uganda</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Phone className="w-5 h-5 text-brand-teal shrink-0" />
                                <div className="flex flex-col">
                                    <a href="tel:+256787324041" className="hover:text-white transition-colors text-sm">+256 787 324 041</a>
                                    <a href="tel:+256708726924" className="hover:text-white transition-colors text-sm">+256 708 726 924</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Mail className="w-5 h-5 text-brand-teal shrink-0" />
                                <a href="mailto:suubimedcarekayunga@gmail.com" className="hover:text-white transition-colors break-all text-sm">suubimedcarekayunga@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        &copy; {currentYear} Suubi Medical Centre. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
