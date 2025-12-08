'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  ArrowRight, 
  Users,
  Stethoscope,
  Baby,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const impactAreas = [
  { icon: Baby, label: 'Maternal Care', count: '500+', color: 'text-pink-500' },
  { icon: Users, label: 'Families Helped', count: '2K+', color: 'text-brand-teal' },
  { icon: Stethoscope, label: 'Medical Treatments', count: '10K+', color: 'text-brand-orange' },
  { icon: GraduationCap, label: 'Health Education', count: '3K+', color: 'text-purple-500' },
];

export default function DonationSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-brand-orange/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <Badge variant="secondary" className="mb-4 bg-red-50 text-red-600 border-red-100">
              <Heart className="w-3 h-3 mr-1 fill-red-500" />
              Make an Impact
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
              Be a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">
                Healthcare Hero
              </span>
            </h2>
            
            <p className="text-brand-navy/60 text-lg mb-8 leading-relaxed">
              Your generosity can save lives. Every donation helps provide essential medical care 
              to underserved communities and individuals who cannot afford healthcare services.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {impactAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={area.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-100"
                  >
                    <div className={cn("w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center", area.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy">{area.count}</p>
                      <p className="text-xs text-brand-navy/50">{area.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-brand-orange to-red-500 hover:from-red-500 hover:to-brand-orange text-white shadow-lg hover:shadow-xl transition-all group"
                >
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Donate Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register-patient">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Register Someone in Need
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-orange/20 to-red-500/20 rounded-3xl blur-2xl" />
              
              {/* Main image */}
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1170"
                    alt="Medical volunteer helping a patient"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
                  
                  {/* Overlay content */}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <div className="flex items-center gap-3 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white fill-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Together We Heal</p>
                        <p className="text-sm text-white/80">Every contribution matters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating donation card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-6 -left-6 hidden md:block"
              >
                <Card className="border-0 shadow-xl bg-white">
                  <CardContent className="p-4">
                    <p className="text-sm text-brand-navy/60 mb-1">Recent Impact</p>
                    <p className="text-2xl font-bold text-brand-orange">$25,000+</p>
                    <p className="text-xs text-brand-navy/50">Raised this month</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
