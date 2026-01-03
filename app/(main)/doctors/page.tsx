"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Stethoscope, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsPage() {
    const doctors = useQuery(api.staffProfiles.listStaffWithUsers, { role: "doctor" });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Heavy Header */}
            <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 font-heading"
                    >
                        Our Medical Specialists
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-2xl"
                    >
                        Meet the experienced team of doctors dedicated to your health and well-being.
                    </motion.p>
                </div>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
                    <Stethoscope className="w-[500px] h-[500px] text-white" />
                </div>
                <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
                    <Award className="w-32 h-32 text-white" />
                </div>
            </section>

            <div className="container-custom py-20">
                {doctors === undefined ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-96 rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doc, index) => (
                            <motion.div
                                key={doc.staffProfile._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-brand-soft hover:shadow-brand-lg transition-all duration-300 border border-gray-100 group"
                            >
                                <div className="relative h-80 bg-brand-navy/5">
                                    {doc.staffProfile.profileImage ? (
                                        <Image
                                            src={doc.staffProfile.profileImage}
                                            alt={`${doc.user.firstName} ${doc.user.lastName}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-navy/30">
                                            <User className="w-24 h-24" />
                                        </div>
                                    )}
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent opacity-60" />
                                </div>

                                <div className="p-8 relative -mt-12 bg-white rounded-t-3xl mx-4">
                                    <h3 className="text-2xl font-bold text-brand-navy mb-1">
                                        Dr. {doc.user.firstName} {doc.user.lastName}
                                    </h3>
                                    <p className="text-brand-teal font-semibold mb-4 uppercase tracking-wide text-sm">
                                        {doc.staffProfile.specialty || "General Practitioner"}
                                    </p>

                                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                                        {doc.staffProfile.bio || "Dedicated medical professional committed to providing excellent patient care."}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {doc.staffProfile.qualifications?.slice(0, 3).map((q: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
                                                <Award className="w-3 h-3" /> {q}
                                            </span>
                                        ))}
                                    </div>

                                    <Button asChild className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl py-6">
                                        <Link href="/booking">Book Appointment</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
