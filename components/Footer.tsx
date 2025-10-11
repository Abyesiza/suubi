'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Footer() {
  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white pt-12 sm:pt-16 pb-6 sm:pb-8 border-t"
    >
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4 text-center sm:text-left">
            <Link href="/" className="flex items-center justify-center sm:justify-start space-x-2 mb-4 sm:mb-6">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Suubi Medical Centre" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-dark-purple">Suubi Medical Centre</span>
            </Link>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Providing quality healthcare services to our community with compassion and excellence.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 pt-2">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-dark-purple">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/services" text="Services" />
              <FooterLink href="/staff" text="Our Staff" />
              <FooterLink href="/appointments" text="Appointments" />
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/donate" text="Donate" />
              <FooterLink href="/contact" text="Contact" />
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-dark-purple">Our Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink href="/services" text="Emergency Care" />
              <FooterLink href="/services" text="Laboratory Services" />
              <FooterLink href="/services" text="Pharmacy" />
              <FooterLink href="/chat" text="Telemedicine" />
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-dark-purple">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-suubi-green flex-shrink-0" />
                <a href="tel:+256708726924" className="text-gray-600 text-sm sm:text-base hover:text-suubi-green transition-colors">
                  +256 708 726 924
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-suubi-green flex-shrink-0" />
                <a href="mailto:suubimedcarekayunga@gmail.com" className="text-gray-600 text-sm sm:text-base hover:text-suubi-green transition-colors break-all">
                  suubimedcarekayunga@gmail.com
                </a>
              </li>
              <li className="flex items-start justify-center sm:justify-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-suubi-green flex-shrink-0 mt-1" />
                <span className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Level 1 Ssebowa House<br />
                  Plot 1 Ssekajja Road, Kayunga Central<br />
                  Kayunga, Uganda
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <p className="text-gray-600 text-sm sm:text-base order-2 sm:order-1">
            © 2025 Suubi Medical Centre. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 order-1 sm:order-2">
            <Link href="#" className="text-gray-600 text-sm sm:text-base hover:text-suubi-green transition-colors touch-target">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 text-sm sm:text-base hover:text-suubi-green transition-colors touch-target">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-600 text-sm sm:text-base hover:text-suubi-green transition-colors inline-block py-1 touch-target"
      >
        {text}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-suubi-green hover:scale-110 transition-all p-2 -m-2 touch-target inline-flex items-center justify-center"
      aria-label="Social media link"
    >
      {icon}
    </Link>
  );
}