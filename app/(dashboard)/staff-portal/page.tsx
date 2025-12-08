"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { format } from "date-fns";

export default function StaffDashboardPage() {
  const { user } = useUser();

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff profile
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Loading state
  if (currentUser === undefined || staffProfile === undefined) {
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
        title={`Welcome, Dr. ${currentUser?.firstName || "Staff"}`}
        description="Here's your schedule and patient overview for today."
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="availability"
              checked={staffProfile?.isAvailable || false}
            />
            <Label htmlFor="availability" className="text-sm">
              {staffProfile?.isAvailable ? "Available" : "Unavailable"}
            </Label>
          </div>
          <Button asChild>
            <Link href="/staff/availability">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Today's Appointments"
          value="--"
          description="Scheduled for today"
          icon={Calendar}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Pending Approvals"
          value="--"
          description="Awaiting your approval"
          icon={AlertCircle}
          iconClassName="bg-brand-amber/10 text-brand-amber"
        />
        <StatsCard
          title="Completed This Week"
          value="--"
          description="Appointments completed"
          icon={CheckCircle}
          iconClassName="bg-brand-eucalyptus/10 text-brand-eucalyptus"
        />
        <StatsCard
          title="Unread Messages"
          value="--"
          description="From patients"
          icon={MessageSquare}
          iconClassName="bg-brand-orange/10 text-brand-orange"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/staff/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Calendar className="mr-2 h-5 w-5" />
                  <span>No appointments scheduled for today</span>
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
              <CardDescription>Overview of your professional profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={currentUser?.imageUrl || staffProfile?.profileImage}
                    alt={currentUser?.firstName || "Staff"}
                  />
                  <AvatarFallback className="bg-brand-teal text-white text-lg">
                    {(currentUser?.firstName?.[0] || "") +
                      (currentUser?.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {staffProfile?.role?.replace("_", " ")}
                    {staffProfile?.specialty && ` • ${staffProfile?.specialty}`}
                  </p>
                  <StatusBadge
                    status={staffProfile?.verified ? "verified" : "unverified"}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="font-medium">
                    {staffProfile?.experience
                      ? `${staffProfile.experience} years`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Consultation Fee</p>
                  <p className="font-medium">
                    {staffProfile?.consultationFee
                      ? `UGX ${staffProfile.consultationFee.toLocaleString()}`
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-medium">
                    {staffProfile?.rating
                      ? `${staffProfile.rating.toFixed(1)} / 5`
                      : "No ratings yet"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="font-medium">
                    {staffProfile?.languages?.join(", ") || "Not specified"}
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/staff/profile">Edit Profile</Link>
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
            <CardDescription>Common tasks for your daily workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/staff/appointments">
                  <Calendar className="h-6 w-6 text-brand-teal" />
                  <span>View Appointments</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/staff/availability">
                  <Clock className="h-6 w-6 text-brand-eucalyptus" />
                  <span>Set Availability</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/staff/patients">
                  <Users className="h-6 w-6 text-brand-amber" />
                  <span>My Patients</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
                <Link href="/staff/messages">
                  <MessageSquare className="h-6 w-6 text-brand-orange" />
                  <span>Messages</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
