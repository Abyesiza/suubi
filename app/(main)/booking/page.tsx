"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle, User, Activity, ArrowRight, ArrowLeft, Stethoscope, CalendarCheck, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Service categories (Simplified)
const SERVICES = [
    { id: "consultation", label: "General Consultation", icon: Activity, desc: "Primary care and checkups" },
    { id: "dental", label: "Dental Care", icon: Activity, desc: "Teeth cleaning and oral health" },
    { id: "maternal", label: "Maternal Health", icon: Activity, desc: "Prenatal and postnatal care" },
    { id: "specialist", label: "Specialist Visit", icon: Activity, desc: "Heart, Skin, and other specialties" },
];

export default function BookingPage() {
    const { user, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const staffProfileId = searchParams.get("staffProfileId");

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: "",
        date: undefined as Date | undefined,
        timeSlot: "",
        reason: "",
    });

    // Fetch current user from Convex
    const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id });

    // Fetch staff profile if ID is present
    const staffProfile = useQuery(
        api.staffProfiles.getPublicProfile,
        staffProfileId ? { id: staffProfileId as Id<"staff_profiles"> } : "skip"
    );

    const createAppointment = useMutation(api.appointments.createAppointment);

    // Auto-select service if booking specific staff
    useEffect(() => {
        if (staffProfileId && staffProfile) {
            // Default to consultation or specialist depending on role
            const defaultService = staffProfile.role === 'doctor' ? 'consultation' : 'consultation';
            setFormData(prev => ({ ...prev, service: defaultService }));
            // Auto-advance to time selection if we have a staff member
            if (step === 1) setStep(2);
        }
    }, [staffProfileId, staffProfile, step]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!formData.date || !formData.timeSlot || !currentUser || !formData.service) {
            toast.error("Please complete all details.");
            return;
        }

        try {
            // Combine date and time
            const [hours, minutes] = formData.timeSlot.split(':').map(Number);
            const appointmentDate = new Date(formData.date);
            appointmentDate.setHours(hours, minutes);

            await createAppointment({
                patientId: currentUser._id,
                staffProfileId: staffProfileId ? (staffProfileId as Id<"staff_profiles">) : undefined,
                appointmentDate: appointmentDate.getTime(),
                reason: formData.reason,
                appointmentType: "consultation", // Could derive from service
                createdById: currentUser._id,
            });

            toast.success("Appointment Request Sent!");
            setStep(4); // Success step
        } catch (error) {
            console.error(error);
            toast.error("Failed to book appointment. Please try again.");
        }
    };

    // Simplified time slots for "Request Appointment" model
    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Heavy Header */}
            <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
                <div className="container-custom relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6 font-heading"
                    >
                        Book an Appointment
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Schedule your visit in 3 simple steps. We are here to serve you.
                    </motion.p>
                </div>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
                    <CalendarCheck className="w-[500px] h-[500px] text-white" />
                </div>
                <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
                    <Stethoscope className="w-32 h-32 text-white" />
                </div>
            </section>

            <div className="container-custom max-w-5xl -mt-20 relative z-20 pb-24">
                <div className="bg-white rounded-3xl shadow-brand-lg overflow-hidden border border-gray-100 min-h-[600px] flex flex-col md:flex-row">
                    {/* Sidebar Steps */}
                    <div className="bg-brand-navy/5 md:w-80 p-8 border-r border-gray-100 flex flex-col">
                        {staffProfile && (
                            <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border border-brand-teal/20">
                                <p className="text-xs text-brand-teal font-semibold uppercase mb-2">Booking With</p>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-gray-100">
                                        <AvatarImage src={staffProfile.profileImage || staffProfile.user.imageUrl} />
                                        <AvatarFallback>{staffProfile.user.firstName?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-sm text-brand-navy line-clamp-1">
                                            {staffProfile.role === 'doctor' ? 'Dr. ' : ''}
                                            {staffProfile.user.firstName} {staffProfile.user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">{staffProfile.specialty}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 relative">
                                    {/* Connecting line */}
                                    {i < 3 && <div className={cn("absolute left-5 top-10 w-0.5 h-10 bg-gray-200", step > i && "bg-brand-teal")} />}

                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all z-10",
                                        step >= i ? "bg-brand-teal border-brand-teal text-white" : "border-gray-200 text-gray-400 bg-white"
                                    )}>
                                        {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                                    </div>
                                    <div className={cn(
                                        "text-lg font-medium transition-colors",
                                        step >= i ? "text-brand-navy" : "text-gray-400"
                                    )}>
                                        {i === 1 && "Service"}
                                        {i === 2 && "Date & Time"}
                                        {i === 3 && "Details"}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto p-4 bg-brand-orange/10 rounded-xl mt-8">
                            <p className="text-brand-orange font-bold text-sm mb-1">Emergency?</p>
                            <p className="text-sm text-gray-600">Call us immediately at <span className="font-bold text-brand-navy">+256 708 726 924</span></p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Service Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-brand-navy mb-2">What do you need help with?</h2>
                                    <p className="text-gray-500 mb-6">Select the service that best matches your needs.</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {SERVICES.map((s) => (
                                            <div
                                                key={s.id}
                                                onClick={() => setFormData({ ...formData, service: s.id })}
                                                className={cn(
                                                    "p-6 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50 flex items-start gap-4",
                                                    formData.service === s.id ? "border-brand-teal bg-brand-teal/5 shadow-brand-sm" : "border-gray-100"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1",
                                                    formData.service === s.id ? "bg-brand-teal text-white" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brand-navy">{s.label}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-8">
                                        <Button onClick={handleNext} disabled={!formData.service} size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl px-8">
                                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Date & Time (Replaced Doctor Selection) */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-brand-navy mb-6">When would you like to come?</h2>

                                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                                        <div className="flex-1 w-full lg:w-auto">
                                            <Label className="mb-4 block text-base font-semibold text-gray-700">Select Date</Label>
                                            <div className="border rounded-xl shadow-sm bg-white p-4 w-fit mx-auto lg:mx-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date}
                                                    onSelect={(date) => setFormData({ ...formData, date, timeSlot: "" })} // Reset time on date change
                                                    className="p-0"
                                                    disabled={(date) => date! < new Date(new Date().setHours(0, 0, 0, 0))}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full">
                                            <Label className="mb-4 block text-base font-semibold text-gray-700">
                                                Select Time
                                                {staffProfile && <span className="text-xs font-normal text-muted-foreground ml-2">(Provider Availability)</span>}
                                            </Label>
                                            {formData.date ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {timeSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => setFormData({ ...formData, timeSlot: time })}
                                                            className={cn(
                                                                "py-2 px-4 rounded-lg text-sm font-medium border transition-all min-w-[80px]",
                                                                formData.timeSlot === time
                                                                    ? "bg-brand-navy text-white border-brand-navy shadow-md scale-105"
                                                                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-teal hover:text-brand-teal hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 min-h-[200px]">
                                                    <p>Select a date first</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                                        <Button variant="outline" onClick={handleBack} size="lg" className="rounded-xl border-gray-200">
                                            <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                        </Button>
                                        <Button onClick={handleNext} disabled={!formData.date || !formData.timeSlot} size="lg" className="bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl px-8">
                                            Continue <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Details & Confirmation */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-brand-navy mb-6">Almost done!</h2>

                                    {isLoaded && !user ? (
                                        <div className="bg-brand-teal/5 p-8 rounded-2xl text-center border dashed border-brand-teal/30">
                                            <User className="w-12 h-12 text-brand-teal mx-auto mb-4" />
                                            <p className="mb-6 text-gray-600 font-medium">Please sign in to complete your booking.</p>
                                            <Button asChild size="lg" className="bg-brand-navy hover:bg-brand-navy-light text-white rounded-full">
                                                <a href="/sign-in?redirect_url=/booking">Sign In / Register</a>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Personal Details</Label>
                                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                                        <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Reason for Visit</Label>
                                                    <Textarea
                                                        placeholder="Briefly describe your symptoms or reason for visit..."
                                                        className="min-h-[120px] rounded-xl border-gray-200 focus:border-brand-teal"
                                                        value={formData.reason}
                                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-brand-navy text-white p-6 rounded-2xl h-fit">
                                                <h3 className="font-bold text-lg mb-4 border-b border-white/10 pb-4">Booking Summary</h3>
                                                <div className="space-y-4 text-sm">
                                                    {staffProfile && (
                                                        <div className="flex justify-between">
                                                            <span className="text-white/60">Provider</span>
                                                            <span className="font-semibold">
                                                                {staffProfile.role === 'doctor' ? 'Dr. ' : ''}
                                                                {staffProfile.user.firstName} {staffProfile.user.lastName}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-white/60">Service</span>
                                                        <span className="font-semibold">{SERVICES.find(s => s.id === formData.service)?.label}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-white/60">Date</span>
                                                        <span className="font-semibold">{formData.date ? format(formData.date, "MMMM do, yyyy") : "-"}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-white/60">Time</span>
                                                        <span className="font-semibold">{formData.timeSlot}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
                                        <Button variant="outline" onClick={handleBack} size="lg" className="rounded-xl border-gray-200">
                                            <ArrowLeft className="mr-2 w-4 h-4" /> Back
                                        </Button>
                                        <Button onClick={handleSubmit} disabled={!user || !formData.reason} size="lg" className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl px-8 shadow-lg">
                                            Confirm Appointment
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 4: Success */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 shadow-sm">
                                        <CheckCircle className="w-12 h-12" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-brand-navy mb-4">You're All Set!</h2>
                                    <p className="text-gray-600 mb-8 max-w-md text-lg">
                                        Your appointment request has been received. You will receive a confirmation email shortly.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button asChild variant="outline" className="rounded-full px-6">
                                            <a href="/">Return Home</a>
                                        </Button>
                                        <Button asChild className="bg-brand-navy text-white rounded-full px-8">
                                            <a href="/dashboard">View Dashboard</a>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
