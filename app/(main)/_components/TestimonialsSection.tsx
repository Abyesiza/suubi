'use client';

import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: "The doctors at Suubi actually listen and take time to understand my concerns. They focus on prevention, not just treatment. Healthcare reimagined!",
    name: "Margaret Namukasa",
    title: "Patient since 2024",
    avatar: "/avatars/patient1.jpg",
    rating: 5,
    highlight: "Preventive care"
  },
  {
    quote: "Exceptional care and always on time. The online booking system is so convenient. This is how healthcare should be everywhere.",
    name: "Kamuhanga Samuel",
    title: "Patient since 2025",
    avatar: "/avatars/patient2.jpg",
    rating: 5,
    highlight: "Convenient booking"
  },
  {
    quote: "The maternal care team was incredible during my pregnancy. They made me feel safe and supported throughout my entire journey.",
    name: "Grace Nakato",
    title: "New Mother",
    avatar: "/avatars/patient3.jpg",
    rating: 5,
    highlight: "Maternal care"
  },
  {
    quote: "I was able to get a same-day appointment when I was feeling unwell. The staff were compassionate and professional. Highly recommend!",
    name: "David Mugisha",
    title: "Patient since 2024",
    avatar: "/avatars/patient4.jpg",
    rating: 5,
    highlight: "Same-day care"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-brand-sky/5 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-brand-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
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
            <MessageCircle className="w-3 h-3 mr-1" />
            What Our Patients Say
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            Stories of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-eucalyptus">
              Healing & Hope
            </span>
          </h2>
          <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg">
            Real experiences from real patients. Their stories inspire us to do better every day.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-100 hover:border-brand-teal/30 hover:shadow-lg transition-all duration-300 bg-white group">
                <CardContent className="p-6">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="w-10 h-10 text-brand-teal/20 group-hover:text-brand-teal/40 transition-colors" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < testimonial.rating 
                            ? "text-amber-400 fill-amber-400" 
                            : "text-gray-200"
                        )}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-brand-navy/80 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Highlight badge */}
                  <Badge variant="outline" className="mb-4 text-xs border-brand-teal/20 text-brand-teal">
                    {testimonial.highlight}
                  </Badge>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Avatar className="w-12 h-12 border-2 border-brand-teal/20">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-brand-teal/10 text-brand-teal font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-brand-navy">{testimonial.name}</p>
                      <p className="text-sm text-brand-navy/50">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-teal/10 to-brand-eucalyptus/10 border border-brand-teal/20">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal to-brand-eucalyptus border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm text-brand-navy ml-2">
              <strong>4.9</strong> from <strong>500+</strong> reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
