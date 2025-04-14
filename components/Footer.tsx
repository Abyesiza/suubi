'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
      className="bg-white pt-16 pb-8 border-t"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Heart className="h-8 w-8 text-[rgb(var(--primary-600))]" />
              <span className="text-2xl font-bold">Suubi Healthcare</span>
            </Link>
            <p className="text-gray-600">
              Providing quality healthcare services to our community with compassion and excellence.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/doctors" text="Find a Doctor" />
              <FooterLink href="/appointments" text="Book Appointment" />
              <FooterLink href="/health-assessment" text="Health Assessment" />
              <FooterLink href="/chat" text="Chat with Doctor" />
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <FooterLink href="#" text="Emergency Care" />
              <FooterLink href="#" text="Laboratory Services" />
              <FooterLink href="#" text="Pharmacy" />
              <FooterLink href="#" text="Telemedicine" />
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[rgb(var(--primary-600))]" />
                <span className="text-gray-600">+256 700 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[rgb(var(--primary-600))]" />
                <span className="text-gray-600">contact@suubihealthcare.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[rgb(var(--primary-600))]" />
                <span className="text-gray-600">
                  Plot 123, Kampala Road<br />
                  Kampala, Uganda
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 mt-8 border-t border-gray-200 text-center md:flex md:justify-between md:text-left"
        >
          <p className="text-gray-600 mb-4 md:mb-0">
            © 2024 Suubi Healthcare. All rights reserved.
          </p>
          <div className="space-x-6">
            <Link href="#" className="text-gray-600 hover:text-[rgb(var(--primary-600))] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[rgb(var(--primary-600))] transition-colors">
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
        className="text-gray-600 hover:text-[rgb(var(--primary-600))] transition-colors"
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
      className="text-gray-600 hover:text-[rgb(var(--primary-600))] transition-colors"
    >
      {icon}
    </Link>
  );
}