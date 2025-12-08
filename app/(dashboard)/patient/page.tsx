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

  // Loading state
  if (currentUser === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

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
        <Button asChild>
          <Link href="/appointments">
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
          value="--"
          description="Scheduled appointments"
          icon={Calendar}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Past Visits"
          value="--"
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
          <Card>
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
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <span>No upcoming appointments</span>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/appointments">
                      Book an appointment
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Overview */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Your health information overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
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
                  <h3 className="font-semibold">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {currentUser?.phoneNumber || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {currentUser?.dateOfBirth
                      ? format(new Date(currentUser.dateOfBirth), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">
                    {currentUser?.gender?.replace("_", " ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">
                    {currentUser?.emergencyContact || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Health Information */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Health Information</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Known Allergies</p>
                    <p className="text-sm">
                      {currentUser?.allergies?.length
                        ? currentUser.allergies.join(", ")
                        : "None recorded"}
                    </p>
                  </div>
                  <div>
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/appointments">
                  <Calendar className="h-6 w-6 text-brand-teal" />
                  <span>Book Appointment</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/patient/messages">
                  <MessageSquare className="h-6 w-6 text-brand-eucalyptus" />
                  <span>Message Doctor</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/patient/records">
                  <ClipboardList className="h-6 w-6 text-brand-amber" />
                  <span>View Records</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
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
        <Card className="bg-gradient-to-r from-brand-teal/10 to-brand-eucalyptus/10 border-brand-teal/20">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal/20">
                <Heart className="h-6 w-6 text-brand-teal" />
              </div>
              <div>
                <h3 className="font-semibold">Stay Healthy</h3>
                <p className="text-sm text-muted-foreground">
                  Regular check-ups help prevent health issues. Book your next appointment today.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/appointments">
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
