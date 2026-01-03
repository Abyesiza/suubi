"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Heart,
  MessageSquare,
  ClipboardList,
  Clock,
  User,
  Plus,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { format } from "date-fns";

export default function PatientDashboardPage() {
  const { user } = useUser();

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Fetch appointments with staff info for current user
  const appointments = useQuery(
    api.appointments.getPatientAppointmentsWithStaff,
    currentUser?._id ? { patientId: currentUser._id, limit: 50 } : "skip"
  );

  // Loading state
  if (currentUser === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Calculate stats from real data
  const now = Date.now();
  const upcomingAppointments = appointments?.filter(
    (apt) => apt.appointmentDate >= now && !["cancelled", "completed", "no_show"].includes(apt.status)
  ) || [];
  const completedAppointments = appointments?.filter(
    (apt) => apt.status === "completed"
  ) || [];

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title={`Welcome, ${currentUser?.firstName || "Patient"}`}
        description="Manage your health and appointments at Suubi Medical Centre."
      >
        <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
          <Link href="/booking">
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          description="Scheduled appointments"
          icon={Calendar}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Past Visits"
          value={completedAppointments.length}
          description="Completed appointments"
          icon={Clock}
          iconClassName="bg-brand-eucalyptus/10 text-brand-eucalyptus"
        />
        <StatsCard
          title="Unread Messages"
          value="--"
          description="From your doctors"
          icon={MessageSquare}
          iconClassName="bg-brand-amber/10 text-brand-amber"
        />
        <StatsCard
          title="Health Records"
          value="--"
          description="Medical records"
          icon={ClipboardList}
          iconClassName="bg-brand-orange/10 text-brand-orange"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/patient/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt._id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={apt.staffProfile?.profileImage || apt.staffUser?.imageUrl}
                            alt={apt.staffUser?.firstName || "Doctor"}
                          />
                          <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                            <Stethoscope className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-brand-navy">
                            {apt.staffUser ? `Dr. ${apt.staffUser.firstName} ${apt.staffUser.lastName}` : "Pending Assignment"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(apt.appointmentDate), "MMM d, yyyy")} at{" "}
                            {format(new Date(apt.appointmentDate), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <span>No upcoming appointments</span>
                    <Button variant="link" asChild className="mt-2">
                      <Link href="/booking">
                        Book an appointment
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Overview */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Your health information overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarImage
                    src={currentUser?.imageUrl}
                    alt={currentUser?.firstName || "Patient"}
                  />
                  <AvatarFallback className="bg-brand-eucalyptus text-white text-lg">
                    {(currentUser?.firstName?.[0] || "") +
                      (currentUser?.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-brand-navy">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-sm">
                    {currentUser?.phoneNumber || "Not specified"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium text-sm">
                    {currentUser?.dateOfBirth
                      ? format(new Date(currentUser.dateOfBirth), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize text-sm">
                    {currentUser?.gender?.replace("_", " ") || "Not specified"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium text-sm">
                    {currentUser?.emergencyContact || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Health Information */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3 text-brand-navy">Health Information</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-muted-foreground">Known Allergies</p>
                    <p className="text-sm">
                      {currentUser?.allergies?.length
                        ? currentUser.allergies.join(", ")
                        : "None recorded"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-muted-foreground">Current Medications</p>
                    <p className="text-sm">
                      {currentUser?.currentMedications?.length
                        ? currentUser.currentMedications.join(", ")
                        : "None recorded"}
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/patient/profile">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-brand-soft border-gray-100">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-teal/5 hover:border-brand-teal" asChild>
                <Link href="/booking">
                  <Calendar className="h-6 w-6 text-brand-teal" />
                  <span>Book Appointment</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-eucalyptus/5 hover:border-brand-eucalyptus" asChild>
                <Link href="/patient/messages">
                  <MessageSquare className="h-6 w-6 text-brand-eucalyptus" />
                  <span>Message Doctor</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-amber/5 hover:border-brand-amber" asChild>
                <Link href="/patient/records">
                  <ClipboardList className="h-6 w-6 text-brand-amber" />
                  <span>View Records</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-orange/5 hover:border-brand-orange" asChild>
                <Link href="/health-assessment">
                  <Heart className="h-6 w-6 text-brand-orange" />
                  <span>Health Check</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Tips */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-brand-teal/10 to-brand-eucalyptus/10 border-brand-teal/20 shadow-brand-soft">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/20">
                <Heart className="h-6 w-6 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy">Stay Healthy</h3>
                <p className="text-sm text-muted-foreground">
                  Regular check-ups help prevent health issues. Book your next appointment today.
                </p>
              </div>
            </div>
            <Button asChild className="bg-brand-teal hover:bg-brand-teal/90">
              <Link href="/booking">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
