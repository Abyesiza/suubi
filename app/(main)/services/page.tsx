"use client";

import { motion } from "framer-motion";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Microscope, Baby, Stethoscope, HeartPulse, Calendar, MapPin as MapPinIcon, Activity } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-heading"
          >
            Our Medical Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Comprehensive healthcare solutions tailored to your needs.
          </motion.p>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
          <Stethoscope className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
          <HeartPulse className="w-32 h-32 text-white" />
        </div>
      </section>

      {/* Main Grid */}
      <ServicesGrid />

      {/* Detailed Sections */}
      <section className="py-24 bg-white">
        <div className="container-custom space-y-24">
          {/* Maternal Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 mb-6">
                <Baby className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Maternal & Child Health</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our specialized unit provides complete care for mothers and babies. From antenatal checkups to delivery and postnatal care, we ensure a safe and comfortable journey for you and your little one.
              </p>
              <ul className="space-y-3 mb-8">
                {['Antenatal Classes', 'Safe Delivery', 'Immunization', 'Pediatric Care'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-pink-500" /> {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-brand-navy text-white rounded-full">
                <Link href="/booking">Book Consultation</Link>
              </Button>
            </div>
            <div className="order-1 md:order-2 bg-pink-50 rounded-3xl h-[400px] relative overflow-hidden">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center text-pink-200">
                <Baby className="w-32 h-32" />
              </div>
            </div>
          </div>

          {/* Laboratory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-brand-teal/10 rounded-3xl h-[400px] relative overflow-hidden">
              {/* Placeholder for image */}
              <div className="absolute inset-0 flex items-center justify-center text-brand-teal/20">
                <Microscope className="w-32 h-32" />
              </div>
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-brand-teal/20 flex items-center justify-center text-brand-teal mb-6">
                <Microscope className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">Diagnostic Laboratory</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Equipped with modern technology, our laboratory ensures accurate and timely results for proper diagnosis and treatment.
              </p>
              <ul className="space-y-3 mb-8">
                {['Blood Analysis', 'Parasitology', 'Biochemistry', 'Microbiology'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-brand-teal" /> {item}
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-brand-navy text-white rounded-full">
                <Link href="/booking">Book Lab Test</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Programs - Dynamic Section */}
      <ProgramsSection />

      {/* CTA */}
      <section className="py-20 bg-brand-orange text-white text-center">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-6">Need Emergency Care?</h2>
          <p className="text-xl mb-8 opacity-90">Our emergency department is open 24/7 to handle critical situations.</p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="secondary" size="lg" className="rounded-full bg-white text-brand-orange hover:bg-white/90">
              <a href="tel:+256700000000">Call Ambulance</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProgramsSection() {
  const programs = useQuery(api.programs.getApprovedPrograms);

  if (!programs || programs.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 font-heading text-brand-navy">Community Programs & Events</h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Stay updated with our ongoing health initiatives and community outreach programs designed to serve you better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program._id} className="bg-white rounded-3xl overflow-hidden shadow-brand-soft hover:shadow-brand-md transition-all duration-300 group">
              <div className="h-48 bg-brand-navy/5 relative overflow-hidden">
                {/* Fallback image if no image URL, or map over images */}
                {program.images && program.images.length > 0 ? (
                  <img src={program.images[0]} alt={program.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-navy/20">
                    <Activity className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-navy uppercase tracking-wider">
                  {program.status}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-brand-orange" />
                    <span>{format(program.startDate, "MMM d, yyyy")}</span>
                  </div>
                  {program.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-brand-teal" />
                      <span className="truncate max-w-[100px]">{program.location}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3 line-clamp-1 group-hover:text-brand-orange transition-colors">
                  {program.name}
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-6">
                  {program.description}
                </p>
                <Button variant="link" className="p-0 h-auto text-brand-teal hover:text-brand-navy font-semibold group-hover:translate-x-1 transition-all">
                  Learn More <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
