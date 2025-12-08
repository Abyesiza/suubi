'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Heart,
  Brain,
  Wind,
  Stethoscope,
  Baby,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Sparkles,
  Calendar,
  Phone,
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Services data
const services = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    icon: Heart,
    color: 'bg-red-500/10 text-red-500',
    shortDescription: 'Comprehensive heart care with cutting-edge diagnostics and treatments.',
    longDescription: 'Our cardiology department provides comprehensive care for a wide range of heart conditions. Our team of experienced cardiologists uses state-of-the-art technology for diagnosis and treatment, including echocardiography, stress testing, cardiac catheterization, and more. We specialize in preventive cardiology, heart rhythm disorders, heart failure management, and interventional procedures.',
    procedures: ['Echocardiogram', 'Stress Testing', 'Holter Monitoring', 'Cardiac Catheterization', 'Pacemaker Implantation'],
    features: ['24/7 Emergency Care', 'Expert Cardiologists', 'Advanced Equipment'],
  },
  {
    id: 'neurology',
    name: 'Neurology',
    icon: Brain,
    color: 'bg-purple-500/10 text-purple-500',
    shortDescription: 'Expert care for conditions affecting the brain, spine, and nervous system.',
    longDescription: "Our neurology department specializes in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. Our neurologists work closely with neurosurgeons, neuroradiologists, and other specialists to provide comprehensive care for patients with neurological conditions like stroke, epilepsy, multiple sclerosis, Parkinson's disease, and headache disorders.",
    procedures: ['EEG', 'EMG/NCS', 'Sleep Studies', 'Lumbar Puncture', 'Neuropsychological Testing'],
    features: ['Stroke Unit', 'Epilepsy Center', 'Movement Disorder Clinic'],
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    icon: Wind,
    color: 'bg-sky-500/10 text-sky-500',
    shortDescription: 'Specialized care for respiratory conditions and lung diseases.',
    longDescription: 'Our pulmonology department focuses on the diagnosis and treatment of conditions affecting the respiratory system. Our pulmonologists are experts in managing conditions such as asthma, COPD, sleep apnea, pneumonia, pulmonary fibrosis, and lung cancer. We offer comprehensive pulmonary function testing, sleep studies, bronchoscopy, and other advanced diagnostic and therapeutic procedures.',
    procedures: ['Pulmonary Function Tests', 'Bronchoscopy', 'Thoracentesis', 'Sleep Studies', 'Oxygen Therapy Assessment'],
    features: ['Respiratory Care', 'Sleep Lab', 'Pulmonary Rehab'],
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    icon: Baby,
    color: 'bg-pink-500/10 text-pink-500',
    shortDescription: 'Compassionate care for infants, children, and adolescents.',
    longDescription: 'Our pediatrics department provides comprehensive healthcare for children from birth through adolescence. Our pediatricians are dedicated to providing preventive care, managing acute and chronic illnesses, and promoting healthy development. We offer well-child visits, immunizations, growth and development monitoring, and treatment for a wide range of pediatric conditions in a child-friendly environment.',
    procedures: ['Well-Child Visits', 'Immunizations', 'Developmental Screening', 'School/Sports Physicals', 'Acute Illness Care'],
    features: ['Child-Friendly Environment', 'Vaccination Programs', 'Developmental Support'],
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    icon: Eye,
    color: 'bg-emerald-500/10 text-emerald-500',
    shortDescription: 'Advanced eye care for optimal vision and eye health.',
    longDescription: 'Our ophthalmology department provides comprehensive eye care for patients of all ages. Our ophthalmologists diagnose and treat a wide range of eye conditions, including cataracts, glaucoma, diabetic retinopathy, macular degeneration, and refractive errors. We offer routine eye exams, advanced diagnostic testing, surgical procedures, and management of chronic eye conditions to preserve and improve vision.',
    procedures: ['Comprehensive Eye Exams', 'Cataract Surgery', 'Glaucoma Treatment', 'Diabetic Eye Care', 'LASIK/Refractive Surgery'],
    features: ['Advanced Diagnostics', 'Surgical Excellence', 'Vision Correction'],
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    icon: Stethoscope,
    color: 'bg-brand-teal/10 text-brand-teal',
    shortDescription: 'Primary care services for adults with a focus on prevention and wellness.',
    longDescription: 'Our general medicine department provides primary care services for adults, with a focus on preventive care, health maintenance, and management of chronic conditions. Our internists and family practitioners offer comprehensive physical exams, health screenings, vaccinations, and treatment for a wide range of medical conditions. We emphasize patient education and partnership to promote long-term health and wellbeing.',
    procedures: ['Annual Physical Exams', 'Health Screenings', 'Vaccinations', 'Chronic Disease Management', 'Minor Office Procedures'],
    features: ['Preventive Care', 'Chronic Disease Management', 'Patient Education'],
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Quality Care',
    description: 'Our services meet the highest healthcare standards',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock care for emergencies',
  },
  {
    icon: Heart,
    title: 'Patient-Centered',
    description: 'Personalized treatment plans for every patient',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-eucalyptus/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Healthcare Services
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Our{' '}
              <span className="bg-gradient-to-r from-brand-teal to-brand-eucalyptus bg-clip-text text-transparent">
                Medical Services
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            >
              Discover our comprehensive range of healthcare services designed to address all your medical needs with compassion and expertise.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal mb-2">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground hidden sm:block">{benefit.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-muted">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={service.id} className="border-none">
                      <AccordionTrigger className="p-4 md:p-6 hover:no-underline [&[data-state=open]]:bg-muted/30">
                        <div className="flex items-center gap-4 text-left flex-1">
                          <div className={`p-3 rounded-xl ${service.color}`}>
                            <service.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
                              {service.shortDescription}
                            </p>
                          </div>
                          <div className="hidden md:flex gap-2">
                            {service.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 md:px-6 pb-6">
                        <div className="pt-4 border-t">
                          <p className="text-muted-foreground mb-6">{service.longDescription}</p>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-brand-teal" />
                                Common Procedures
                              </h4>
                              <ul className="space-y-2">
                                {service.procedures.map((procedure, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                                    {procedure}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex flex-col gap-4">
                              <div className="p-4 rounded-xl bg-muted/50">
                                <h4 className="font-semibold mb-2">Key Features</h4>
                                <div className="flex flex-wrap gap-2">
                                  {service.features.map((feature, i) => (
                                    <Badge key={i} className="bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button asChild className="bg-brand-teal hover:bg-brand-teal/90">
                                <Link href={`/appointments?service=${service.id}`}>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Appointment
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy to-brand-teal p-8 md:p-12"
          >
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Not sure which service you need?</h2>
                <p className="text-white/80 mb-6">
                  Our healthcare professionals can help determine the most appropriate services for your specific needs. Take our health assessment or contact us for guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-white text-brand-navy hover:bg-white/90">
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link href="/health-assessment">
                      Take Health Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, text: '24/7 Support' },
                  { icon: Shield, text: 'Trusted Care' },
                  { icon: Heart, text: 'Expert Staff' },
                  { icon: CheckCircle, text: 'Quality Service' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/10 text-white"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
