"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  UserPlus,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
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
import { format, startOfDay, endOfDay } from "date-fns";

export default function AdminDashboardPage() {
  const { user } = useUser();

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff members
  const staffMembers = useQuery(api.users.getStaffMembers, {
    limit: 10,
  });

  // Get patients
  const patients = useQuery(api.users.getPatients, {
    limit: 10,
  });

  // Get all appointments for admin (if the function exists, otherwise we'll calculate from staff)
  const allAppointments = useQuery(
    api.appointments.getAllAppointmentsForAdmin,
    currentUser?._id ? { adminUserId: currentUser._id } : "skip"
  );

  // Loading state
  if (currentUser === undefined || staffMembers === undefined || patients === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Calculate stats
  const totalStaff = staffMembers?.length || 0;
  const totalPatients = patients?.length || 0;
  const verifiedStaff = staffMembers?.filter(s => s.staffProfile.verified).length || 0;
  const availableStaff = staffMembers?.filter(s => s.staffProfile.isAvailable).length || 0;

  // Calculate today's appointments
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();
  const todayAppointments = allAppointments?.filter(
    (apt: any) => apt.appointmentDate >= todayStart && apt.appointmentDate <= todayEnd
  ) || [];

  const pendingAppointments = allAppointments?.filter(
    (apt: any) => apt.status === "pending"
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
        title="Admin Dashboard"
        description="Welcome back! Here's what's happening at Suubi Medical Centre."
      >
        <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
          <Link href="/admin/staff">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          title="Total Staff"
          value={totalStaff}
          description={`${verifiedStaff} verified`}
          icon={Users}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Total Patients"
          value={totalPatients}
          description="Registered patients"
          icon={UserPlus}
          iconClassName="bg-brand-eucalyptus/10 text-brand-eucalyptus"
        />
        <StatsCard
          title="Available Staff"
          value={availableStaff}
          description={`${totalStaff - availableStaff} unavailable`}
          icon={Activity}
          iconClassName="bg-brand-amber/10 text-brand-amber"
        />
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          description={`${pendingAppointments.length} pending`}
          icon={Calendar}
          iconClassName="bg-brand-orange/10 text-brand-orange"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Staff */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Medical Staff</CardTitle>
                <CardDescription>Current staff members</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/staff">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMembers?.slice(0, 5).map((member) => (
                  <div
                    key={member.staffProfile._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={member.user.imageUrl || member.staffProfile.profileImage}
                          alt={member.user.firstName || "Staff"}
                        />
                        <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                          {(member.user.firstName?.[0] || "") +
                            (member.user.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {member.staffProfile.role.replace("_", " ")}
                          {member.staffProfile.specialty &&
                            ` • ${member.staffProfile.specialty}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.staffProfile.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <StatusBadge
                        status={member.staffProfile.verified ? "verified" : "unverified"}
                      />
                    </div>
                  </div>
                ))}
                {(!staffMembers || staffMembers.length === 0) && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No staff members found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Patients */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-brand-soft border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest registered patients</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/patients">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients?.slice(0, 5).map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={patient.imageUrl}
                          alt={patient.firstName || "Patient"}
                        />
                        <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus">
                          {(patient.firstName?.[0] || "") +
                            (patient.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-brand-navy">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {patient.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {patient.createdAt
                        ? format(new Date(patient.createdAt), "MMM d")
                        : "N/A"}
                    </span>
                  </div>
                ))}
                {(!patients || patients.length === 0) && (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No patients found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-brand-soft border-gray-100">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-teal/5 hover:border-brand-teal" asChild>
                <Link href="/admin/appointments">
                  <Calendar className="h-6 w-6 text-brand-teal" />
                  <span>Manage Appointments</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-eucalyptus/5 hover:border-brand-eucalyptus" asChild>
                <Link href="/admin/staff">
                  <Users className="h-6 w-6 text-brand-eucalyptus" />
                  <span>Manage Staff</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-amber/5 hover:border-brand-amber" asChild>
                <Link href="/admin/news">
                  <Activity className="h-6 w-6 text-brand-amber" />
                  <span>Publish News</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4 hover:bg-brand-orange/5 hover:border-brand-orange" asChild>
                <Link href="/admin/programs">
                  <TrendingUp className="h-6 w-6 text-brand-orange" />
                  <span>Manage Programs</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Overview Banner */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white shadow-brand-soft">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Suubi Medical Centre</h3>
                <p className="text-sm text-white/70">
                  System running smoothly • {todayAppointments.length} appointments today
                </p>
              </div>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/admin/settings">
                Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
