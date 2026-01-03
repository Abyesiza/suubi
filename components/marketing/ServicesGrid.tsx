"use client";

import { motion } from "framer-motion";
import { Baby, Stethoscope, Microscope, Scissors, Pill, Activity, UserCog, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        title: "General Consultation",
        description: "Comprehensive medical assessments and personalized care plans for all ages.",
        icon: Stethoscope,
        color: "bg-brand-teal/10 text-brand-teal",
        delay: 0,
    },
    {
        title: "Maternal Health",
        description: "Expert prenatal, antenatal, and postnatal care ensuring safety for mother and baby.",
        icon: Baby,
        color: "bg-pink-500/10 text-pink-500",
        delay: 0.1,
    },
    {
        title: "Laboratory Services",
        description: "Advanced diagnostic testing with quick and accurate results.",
        icon: Microscope,
        color: "bg-brand-navy/10 text-brand-navy",
        delay: 0.2,
    },
    {
        title: "Minor Surgery",
        description: "Safe and sterile minor surgical procedures performed by specialists.",
        icon: Scissors,
        color: "bg-red-500/10 text-red-500",
        delay: 0.3,
    },
    {
        title: "Dental Care",
        description: "Routine checkups, cleaning, and dental treatments for a healthy smile.",
        icon: Sprout, // Using Sprout as placeholder, or Smile if available, sticking to Lucide
        color: "bg-brand-eucalyptus/10 text-brand-eucalyptus",
        delay: 0.4,
    },
    {
        title: "Counseling",
        description: "Professional mental health support and guidance.",
        icon: UserCog,
        color: "bg-brand-amber/10 text-brand-amber",
        delay: 0.5,
    },
];

export function ServicesGrid() {
    return (
        <section className="py-24 bg-brand-navy/5 relative overflow-hidden">
            <div className="container-custom">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 font-heading"
                    >
                        Comprehensive Healthcare
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg"
                    >
                        We provide a wide range of medical services to ensure you and your family receive the best possible care under one roof.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay }}
                            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-brand-md transition-all duration-300 border border-transparent hover:border-brand-teal/20 group hover:-translate-y-1"
                        >
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors", service.color, "group-hover:scale-110 duration-300")}>
                                <service.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-teal transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
