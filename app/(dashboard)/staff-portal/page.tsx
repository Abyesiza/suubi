"use client";

import { useQuery, useMutation } from "convex/react";
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
  XCircle,
  User,
  Stethoscope,
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
import { format, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

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

  // Get staff appointments with patient info
  const appointments = useQuery(
    api.staffProfiles.getStaffAppointments,
    currentUser?._id ? { staffUserId: currentUser._id, limit: 50 } : "skip"
  );

  // Mutations
  const approveAppointment = useMutation(api.appointments.approveAppointment);
  const cancelAppointment = useMutation(api.appointments.cancelAppointment);

  // Loading state
  if (currentUser === undefined || staffProfile === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Calculate stats from real data
  const now = Date.now();
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  const todayAppointments = appointments?.filter(
    (apt) => apt.appointmentDate >= todayStart && apt.appointmentDate <= todayEnd
  ) || [];

  const pendingAppointments = appointments?.filter(
    (apt) => apt.status === "pending"
  ) || [];

  const completedThisWeek = appointments?.filter(
    (apt) => apt.status === "completed" && apt.appointmentDate >= now - 7 * 24 * 60 * 60 * 1000
  ) || [];

  const handleApprove = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await approveAppointment({
        appointmentId: appointmentId as any,
        approvedBy: currentUser._id,
      });
      toast.success("Appointment approved!");
    } catch (error) {
      toast.error("Failed to approve appointment");
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await cancelAppointment({
        appointmentId: appointmentId as any,
        cancelledBy: currentUser._id,
        cancellationReason: "Cancelled by staff",
      });
      toast.success("Appointment cancelled");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
            <div className={`w-2 h-2 rounded-full ${staffProfile?.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {staffProfile?.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
            <Link href="/staff-portal/availability">
              <Clock className="mr-2 h-4 w-4" />
              Set Availability
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-3 grid-cols-2 md:gap-4 lg:grid-cols-4"
      >
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          description="Scheduled for today"
          icon={Calendar}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingAppointments.length}
          description="Awaiting your approval"
          icon={AlertCircle}
          iconClassName="bg-brand-amber/10 text-brand-amber"
        />
        <StatsCard
          title="Completed This Week"
          value={completedThisWeek.length}
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
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/staff-portal/appointments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt._id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage
                            src={apt.patient?.imageUrl}
                            alt={apt.patient?.firstName || "Patient"}
                          />
                          <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus">
                            {(apt.patient?.firstName?.[0] || "") + (apt.patient?.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-brand-navy">
                            {apt.patient?.firstName} {apt.patient?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(apt.appointmentDate), "h:mm a")} • {apt.reason || "Consultation"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>No appointments scheduled for today</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Appointments awaiting your response</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAppointments.length > 0 ? (
                  pendingAppointments.slice(0, 4).map((apt) => (
                    <div
                      key={apt._id}
                      className="p-4 rounded-xl bg-brand-amber/5 border border-brand-amber/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={apt.patient?.imageUrl} />
                            <AvatarFallback className="bg-brand-amber/10 text-brand-amber">
                              {(apt.patient?.firstName?.[0] || "") + (apt.patient?.lastName?.[0] || "")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-brand-navy">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(apt.appointmentDate), "MMM d, yyyy")} at {format(new Date(apt.appointmentDate), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {apt.reason && (
                        <p className="text-sm text-gray-600 mb-3 bg-white p-2 rounded-lg">
                          <strong>Reason:</strong> {apt.reason}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-brand-eucalyptus hover:bg-brand-eucalyptus/90"
                          onClick={() => handleApprove(apt._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleCancel(apt._id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Decline
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mb-2 text-brand-eucalyptus/50" />
                    <span>All caught up! No pending approvals.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profile Overview */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-brand-soft border-gray-100">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Overview of your professional profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                  <AvatarImage
                    src={currentUser?.imageUrl || staffProfile?.profileImage}
                    alt={currentUser?.firstName || "Staff"}
                  />
                  <AvatarFallback className="bg-brand-teal text-white text-xl">
                    {(currentUser?.firstName?.[0] || "") + (currentUser?.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-brand-navy">
                    Dr. {currentUser?.firstName} {currentUser?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {staffProfile?.role?.replace("_", " ")}
                    {staffProfile?.specialty && ` • ${staffProfile.specialty}`}
                  </p>
                  <StatusBadge
                    status={staffProfile?.verified ? "verified" : "unverified"}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="font-semibold">
                    {staffProfile?.experience ? `${staffProfile.experience} years` : "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Consultation Fee</p>
                  <p className="font-semibold">
                    {staffProfile?.consultationFee
                      ? `UGX ${staffProfile.consultationFee.toLocaleString()}`
                      : "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold">
                    {staffProfile?.rating ? `${staffProfile.rating.toFixed(1)} / 5` : "No ratings"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="font-semibold">
                    {staffProfile?.languages?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/staff-portal/profile">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-brand-soft border-gray-100">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your daily workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-teal/5 hover:border-brand-teal" asChild>
                <Link href="/staff-portal/appointments">
                  <Calendar className="h-6 w-6 text-brand-teal" />
                  <span>View Appointments</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-eucalyptus/5 hover:border-brand-eucalyptus" asChild>
                <Link href="/staff-portal/availability">
                  <Clock className="h-6 w-6 text-brand-eucalyptus" />
                  <span>Set Availability</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-amber/5 hover:border-brand-amber" asChild>
                <Link href="/staff-portal/patients">
                  <Users className="h-6 w-6 text-brand-amber" />
                  <span>My Patients</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-orange/5 hover:border-brand-orange" asChild>
                <Link href="/staff-portal/messages">
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
