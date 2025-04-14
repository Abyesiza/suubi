'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Heart, Brain, Wind, Stethoscope, Baby, Eye } from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';
import Link from 'next/link';

// Services data
const services = [
  {
    id: 1,
    name: 'Cardiology',
    icon: <Heart className="h-6 w-6 text-mustard" />,
    shortDescription: 'Comprehensive heart care with cutting-edge diagnostics and treatments.',
    longDescription: 'Our cardiology department provides comprehensive care for a wide range of heart conditions. Our team of experienced cardiologists uses state-of-the-art technology for diagnosis and treatment, including echocardiography, stress testing, cardiac catheterization, and more. We specialize in preventive cardiology, heart rhythm disorders, heart failure management, and interventional procedures.',
    procedures: ['Echocardiogram', 'Stress Testing', 'Holter Monitoring', 'Cardiac Catheterization', 'Pacemaker Implantation'],
  },
  {
    id: 2,
    name: 'Neurology',
    icon: <Brain className="h-6 w-6 text-mustard" />,
    shortDescription: 'Expert care for conditions affecting the brain, spine, and nervous system.',
    longDescription: "Our neurology department specializes in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. Our neurologists work closely with neurosurgeons, neuroradiologists, and other specialists to provide comprehensive care for patients with neurological conditions like stroke, epilepsy, multiple sclerosis, Parkinson's disease, and headache disorders.",
    procedures: ['EEG', 'EMG/NCS', 'Sleep Studies', 'Lumbar Puncture', 'Neuropsychological Testing'],
  },
  {
    id: 3,
    name: 'Pulmonology',
    icon: <Wind className="h-6 w-6 text-mustard" />,
    shortDescription: 'Specialized care for respiratory conditions and lung diseases.',
    longDescription: 'Our pulmonology department focuses on the diagnosis and treatment of conditions affecting the respiratory system. Our pulmonologists are experts in managing conditions such as asthma, COPD, sleep apnea, pneumonia, pulmonary fibrosis, and lung cancer. We offer comprehensive pulmonary function testing, sleep studies, bronchoscopy, and other advanced diagnostic and therapeutic procedures.',
    procedures: ['Pulmonary Function Tests', 'Bronchoscopy', 'Thoracentesis', 'Sleep Studies', 'Oxygen Therapy Assessment'],
  },
  {
    id: 4,
    name: 'Pediatrics',
    icon: <Baby className="h-6 w-6 text-mustard" />,
    shortDescription: 'Compassionate care for infants, children, and adolescents.',
    longDescription: 'Our pediatrics department provides comprehensive healthcare for children from birth through adolescence. Our pediatricians are dedicated to providing preventive care, managing acute and chronic illnesses, and promoting healthy development. We offer well-child visits, immunizations, growth and development monitoring, and treatment for a wide range of pediatric conditions in a child-friendly environment.',
    procedures: ['Well-Child Visits', 'Immunizations', 'Developmental Screening', 'School/Sports Physicals', 'Acute Illness Care'],
  },
  {
    id: 5,
    name: 'Ophthalmology',
    icon: <Eye className="h-6 w-6 text-mustard" />,
    shortDescription: 'Advanced eye care for optimal vision and eye health.',
    longDescription: 'Our ophthalmology department provides comprehensive eye care for patients of all ages. Our ophthalmologists diagnose and treat a wide range of eye conditions, including cataracts, glaucoma, diabetic retinopathy, macular degeneration, and refractive errors. We offer routine eye exams, advanced diagnostic testing, surgical procedures, and management of chronic eye conditions to preserve and improve vision.',
    procedures: ['Comprehensive Eye Exams', 'Cataract Surgery', 'Glaucoma Treatment', 'Diabetic Eye Care', 'LASIK/Refractive Surgery'],
  },
  {
    id: 6,
    name: 'General Medicine',
    icon: <Stethoscope className="h-6 w-6 text-mustard" />,
    shortDescription: 'Primary care services for adults with a focus on prevention and wellness.',
    longDescription: 'Our general medicine department provides primary care services for adults, with a focus on preventive care, health maintenance, and management of chronic conditions. Our internists and family practitioners offer comprehensive physical exams, health screenings, vaccinations, and treatment for a wide range of medical conditions. We emphasize patient education and partnership to promote long-term health and wellbeing.',
    procedures: ['Annual Physical Exams', 'Health Screenings', 'Vaccinations', 'Chronic Disease Management', 'Minor Office Procedures'],
  },
];

export default function ServicesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-dark-purple">Our Medical Services</h1>
          <div className="w-48 h-6 mx-auto mb-4">
            <Lifeline color="#E1AD01" height="12px" variant="minimal" />
          </div>
          <p className="text-dark-purple/80 max-w-2xl mx-auto">
            Discover our comprehensive range of healthcare services designed to address all your medical needs.
          </p>
        </motion.div>
        
        {/* Services Cards with Accordion */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {services.map((service) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-[#73A580]/30 overflow-hidden">
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#73A580]/20 p-2 rounded-full">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-dark-purple">{service.name}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedId === service.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-suubi-green" />
                    </motion.div>
                  </div>
                  <p className="text-dark-purple/70 mt-2 pl-12">{service.shortDescription}</p>
                </div>
                
                <AnimatePresence>
                  {expandedId === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden relative"
                    >
                      <div className="px-6 pb-6 pt-2">
                        {/* Lifeline separator */}
                        <div className="h-6 mb-4">
                          <Lifeline color="#E1AD01" height="12px" variant="minimal" className="opacity-30" />
                        </div>
                        
                        <p className="text-dark-purple/90 mb-4">{service.longDescription}</p>
                        
                        <div className="mt-6">
                          <h4 className="font-medium text-dark-purple mb-2">Common Procedures:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {service.procedures.map((procedure, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-mustard"></div>
                                <span className="text-dark-purple/70">{procedure}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-6">
                          <Link href={`/appointments?service=${service.id}`}>
                            <Button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors">Schedule Appointment</Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-[#73A580]/20 rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-8">
            <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-40" />
          </div>
          
          <div className="max-w-2xl mx-auto py-6">
            <h2 className="text-2xl font-bold mb-4 text-dark-purple">Not sure which service you need?</h2>
            <p className="text-dark-purple/80 mb-6">
              Our healthcare professionals can help determine the most appropriate services for your specific needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors">Contact Us</Button>
              </Link>
              <Link href="/health-assessment">
                <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white">Take Health Assessment</Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-40 transform rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
} 