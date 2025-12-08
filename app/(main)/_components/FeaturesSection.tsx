'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  Clock, 
  Activity, 
  ArrowRight,
  Stethoscope,
  Heart,
  Shield,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book appointments online 24/7 with our simple booking system. No waiting on hold.',
    color: 'from-brand-teal to-brand-eucalyptus',
    bgColor: 'bg-brand-teal/10',
    iconColor: 'text-brand-teal'
  },
  {
    icon: Users,
    title: 'Expert Medical Team',
    description: 'Consult with experienced doctors, nurses, and specialists who genuinely care.',
    color: 'from-brand-orange to-amber-500',
    bgColor: 'bg-brand-orange/10',
    iconColor: 'text-brand-orange'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock emergency services and support for your health needs.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-500'
  },
  {
    icon: Activity,
    title: 'Health Tracking',
    description: 'Monitor your health progress with our integrated digital health records.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-500'
  },
  {
    icon: Stethoscope,
    title: 'Comprehensive Care',
    description: 'From routine checkups to specialized treatments, we cover all your health needs.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-500'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your health information is protected with industry-leading security measures.',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    iconColor: 'text-rose-500'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white via-brand-sky/5 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-72 h-72 bg-brand-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-brand-teal/10 text-brand-teal border-brand-teal/20">
            <Heart className="w-3 h-3 mr-1" />
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            Healthcare That Puts{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-eucalyptus">
              You First
            </span>
          </h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg">
            Experience modern healthcare with compassionate professionals dedicated to your wellbeing.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full border-gray-100 hover:border-brand-teal/30 hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300",
                      feature.bgColor
                    )}>
                      <Icon className={cn("w-7 h-7", feature.iconColor)} />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-navy mb-2 group-hover:text-brand-teal transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-brand-navy/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link href="/services">
            <Button 
              variant="outline" 
              size="lg"
              className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white group"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
