"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DoctorsCarousel() {
    const doctors = useQuery(api.staffProfiles.listStaffWithUsers, {
        role: "doctor"
    });

    if (doctors === undefined) {
        return <DoctorsSkeleton />;
    }

    // Filter only verified doctors or just show all for now? 
    // Ideally verify availability but schema has isAvailable
    // Let's show up to 6 doctors
    const displayDoctors = doctors.slice(0, 6);

    if (displayDoctors.length === 0) {
        return null; // Don't show section if no doctors
    }

    return (
        <section className="py-24 bg-white relative">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 font-heading"
                        >
                            Meet Our Specialists
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 text-lg"
                        >
                            Highly qualified professionals dedicated to providing you with expert medical care.
                        </motion.p>
                    </div>
                    <Button asChild variant="outline" className="hidden md:flex">
                        <Link href="/doctors">View All Doctors</Link>
                    </Button>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {displayDoctors.map((doc, index) => (
                            <CarouselItem key={doc.staffProfile._id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-none shadow-brand-soft hover:shadow-brand-lg transition-all duration-300 group">
                                        <CardContent className="p-0">
                                            <div className="relative h-72 w-full overflow-hidden bg-brand-navy/5">
                                                {doc.staffProfile.profileImage ? (
                                                    <Image
                                                        src={doc.staffProfile.profileImage}
                                                        alt={`${doc.user.firstName} ${doc.user.lastName}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                        <Stethoscope className="w-16 h-16" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <span className="text-white font-medium mb-1">{doc.staffProfile.experience ? `${doc.staffProfile.experience}+ Years Experience` : 'Expert Care'}</span>
                                                    <Button asChild size="sm" className="bg-brand-orange hover:bg-brand-orange-dark text-white border-none w-full">
                                                        <Link href={`/booking`}>Book Appointment</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-teal transition-colors">
                                                    Dr. {doc.user.firstName} {doc.user.lastName}
                                                </h3>
                                                <p className="text-brand-teal font-medium text-sm mb-3">
                                                    {doc.staffProfile.specialty || "General Practitioner"}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {doc.staffProfile.qualifications?.slice(0, 2).map((qual: string, i: number) => (
                                                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1">
                                                            <Award className="w-3 h-3" /> {qual}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-8 md:hidden">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                    <div className="hidden md:block">
                        <CarouselPrevious className="left-[-1rem] xl:left-[-3rem]" />
                        <CarouselNext className="right-[-1rem] xl:right-[-3rem]" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}

function DoctorsSkeleton() {
    return (
        <section className="py-24 bg-white">
            <div className="container-custom">
                <div className="mb-12">
                    <Skeleton className="h-10 w-64 mb-4" />
                    <Skeleton className="h-6 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[400px] rounded-3xl" />
                    ))}
                </div>
            </div>
        </section>
    );
}
