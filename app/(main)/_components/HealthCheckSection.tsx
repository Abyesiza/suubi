'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Smile, 
  Meh, 
  Frown, 
  ThermometerSun,
  ArrowRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const moodOptions = [
  { 
    emoji: '😊', 
    label: 'Great', 
    icon: Smile, 
    color: 'from-green-400 to-emerald-500',
    bgHover: 'hover:bg-green-50 hover:border-green-200',
    selected: 'bg-green-50 border-green-300'
  },
  { 
    emoji: '😐', 
    label: 'Okay', 
    icon: Meh, 
    color: 'from-blue-400 to-cyan-500',
    bgHover: 'hover:bg-blue-50 hover:border-blue-200',
    selected: 'bg-blue-50 border-blue-300'
  },
  { 
    emoji: '😔', 
    label: 'Not Well', 
    icon: Frown, 
    color: 'from-amber-400 to-orange-500',
    bgHover: 'hover:bg-amber-50 hover:border-amber-200',
    selected: 'bg-amber-50 border-amber-300'
  },
  { 
    emoji: '🤒', 
    label: 'Sick', 
    icon: ThermometerSun, 
    color: 'from-red-400 to-rose-500',
    bgHover: 'hover:bg-red-50 hover:border-red-200',
    selected: 'bg-red-50 border-red-300'
  },
];

export default function HealthCheckSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-brand-sky/5 via-white to-brand-teal/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-10 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 bg-brand-orange/10 text-brand-orange border-brand-orange/20">
            <HeartPulse className="w-3 h-3 mr-1" />
            Quick Health Check
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            How Are You Feeling{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
              Today?
            </span>
          </h2>
          <p className="text-brand-navy/60 max-w-xl mx-auto text-lg">
            Take our quick assessment to get personalized health recommendations
          </p>
        </motion.div>

        {/* Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {/* Mood Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {moodOptions.map((mood, index) => (
                  <motion.div
                    key={mood.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link href={`/health-assessment?mood=${mood.label.toLowerCase().replace(' ', '-')}`}>
                      <button
                        className={cn(
                          "w-full p-4 md:p-6 rounded-2xl border-2 border-gray-100 transition-all duration-300 group",
                          mood.bgHover
                        )}
                      >
                        <span className="text-4xl md:text-5xl block mb-2 group-hover:scale-110 transition-transform">
                          {mood.emoji}
                        </span>
                        <span className="text-sm md:text-base font-medium text-brand-navy">
                          {mood.label}
                        </span>
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">or</span>
                </div>
              </div>

              {/* Full Assessment CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <Link href="/health-assessment">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-brand-teal to-brand-eucalyptus hover:from-brand-eucalyptus hover:to-brand-teal text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Take Full Health Assessment
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <p className="text-sm text-brand-navy/50 mt-4">
                  Get personalized recommendations based on your symptoms
                </p>
              </motion.div>
            </CardContent>

            {/* Decorative bottom */}
            <div className="h-2 bg-gradient-to-r from-brand-teal via-brand-orange to-brand-teal" />
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto text-center"
        >
          <div>
            <p className="text-3xl md:text-4xl font-bold text-brand-teal">5K+</p>
            <p className="text-sm text-brand-navy/60">Assessments</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-brand-orange">2 min</p>
            <p className="text-sm text-brand-navy/60">Average Time</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-brand-eucalyptus">Free</p>
            <p className="text-sm text-brand-navy/60">No Cost</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
