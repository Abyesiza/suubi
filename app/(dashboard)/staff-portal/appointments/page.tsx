"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  MoreVertical,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { format, startOfDay, endOfDay } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function StaffAppointmentsPage() {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [actionNotes, setActionNotes] = useState("");

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff profile
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Fetch appointments with patient info
  const appointments = useQuery(
    api.staffProfiles.getStaffAppointments,
    currentUser?._id ? { staffUserId: currentUser._id, limit: 100 } : "skip"
  );

  // Mutations
  const approveAppointment = useMutation(api.staffProfiles.approveAppointment);
  const cancelAppointment = useMutation(api.staffProfiles.cancelAppointment);
  const completeAppointment = useMutation(api.staffProfiles.completeAppointment);
  const markNoShow = useMutation(api.staffProfiles.markNoShow);

  // Loading state
  if (currentUser === undefined || staffProfile === undefined || appointments === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleApprove = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await approveAppointment({
        appointmentId: appointmentId as any,
        staffUserId: currentUser._id,
        notes: actionNotes,
      });
      toast.success("Appointment approved");
      setActionNotes("");
    } catch (error) {
      toast.error("Failed to approve appointment");
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await cancelAppointment({
        appointmentId: appointmentId as any,
        staffUserId: currentUser._id,
        cancellationReason: actionNotes || "Cancelled by staff",
      });
      toast.success("Appointment cancelled");
      setActionNotes("");
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const handleComplete = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await completeAppointment({
        appointmentId: appointmentId as any,
        staffUserId: currentUser._id,
        notes: actionNotes,
      });
      toast.success("Appointment marked as completed");
      setActionNotes("");
    } catch (error) {
      toast.error("Failed to complete appointment");
    }
  };

  const handleNoShow = async (appointmentId: string) => {
    if (!currentUser) return;
    try {
      await markNoShow({
        appointmentId: appointmentId as any,
        staffUserId: currentUser._id,
      });
      toast.success("Appointment marked as no-show");
    } catch (error) {
      toast.error("Failed to mark as no-show");
    }
  };

  // Filter appointments
  const now = Date.now();
  const todayStart = startOfDay(new Date()).getTime();
  const todayEnd = endOfDay(new Date()).getTime();

  const todayAppointments = appointments?.filter(
    (apt) => apt.appointmentDate >= todayStart && apt.appointmentDate <= todayEnd
  ) || [];

  const upcomingAppointments = appointments?.filter(
    (apt) => apt.appointmentDate > todayEnd && !["cancelled", "completed", "no_show"].includes(apt.status)
  ) || [];

  const pendingAppointments = appointments?.filter(
    (apt) => apt.status === "pending"
  ) || [];

  const pastAppointments = appointments?.filter(
    (apt) => apt.appointmentDate < todayStart || ["completed", "no_show"].includes(apt.status)
  ) || [];

  // Search filter
  const filterAppointments = (apps: any[]) => {
    if (!searchQuery) return apps;
    return apps.filter(apt =>
      apt.patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <motion.div variants={itemVariants}>
      <Card className="shadow-sm hover:shadow-md transition-shadow border-gray-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Patient Avatar & Info */}
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white shadow-sm">
                <AvatarImage
                  src={appointment.patient?.imageUrl}
                  alt={appointment.patient?.firstName || "Patient"}
                />
                <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus">
                  {(appointment.patient?.firstName?.[0] || "") + (appointment.patient?.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-navy text-base sm:text-lg truncate">
                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                </h3>
                <p className="text-sm text-gray-500 truncate">{appointment.patient?.email}</p>
                <div className="mt-2">
                  <StatusBadge status={appointment.status} />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">
                  {format(new Date(appointment.appointmentDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">
                  {format(new Date(appointment.appointmentDate), "h:mm a")}
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {appointment.duration || 30} min
                </Badge>
              </div>
              {appointment.reason && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 line-clamp-2">{appointment.reason}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <FileText className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage src={appointment.patient?.imageUrl} />
                        <AvatarFallback className="bg-brand-eucalyptus/10 text-brand-eucalyptus text-xl">
                          {(appointment.patient?.firstName?.[0] || "") + (appointment.patient?.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-brand-navy">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{appointment.patient?.email}</p>
                        {appointment.patient?.phoneNumber && (
                          <p className="text-sm text-gray-500">{appointment.patient.phoneNumber}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date & Time</label>
                        <p className="text-brand-navy font-medium mt-1">
                          {format(new Date(appointment.appointmentDate), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          <StatusBadge status={appointment.status} />
                        </div>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Reason for Visit</label>
                        <p className="text-brand-navy mt-1">{appointment.reason}</p>
                      </div>
                    )}

                    {appointment.symptoms && appointment.symptoms.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Symptoms</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {appointment.symptoms.map((symptom: string, index: number) => (
                            <Badge key={index} variant="secondary">{symptom}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {appointment.notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Notes</label>
                        <p className="text-brand-navy mt-1 text-sm bg-gray-50 p-3 rounded-lg">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    {appointment.status === "pending" && (
                      <div className="pt-4 border-t space-y-3">
                        <Label htmlFor="notes">Add Notes (optional)</Label>
                        <Textarea
                          id="notes"
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder="Add any notes about this appointment..."
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(appointment._id)}
                            className="flex-1 bg-brand-eucalyptus hover:bg-brand-eucalyptus/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleCancel(appointment._id)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    )}

                    {appointment.status === "approved" && appointment.appointmentDate <= now && (
                      <div className="pt-4 border-t space-y-3">
                        <Label htmlFor="completionNotes">Completion Notes (optional)</Label>
                        <Textarea
                          id="completionNotes"
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder="Add notes about the visit..."
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleComplete(appointment._id)}
                            className="flex-1 bg-brand-eucalyptus hover:bg-brand-eucalyptus/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button
                            onClick={() => handleNoShow(appointment._id)}
                            variant="outline"
                            className="flex-1"
                          >
                            No Show
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {appointment.status === "pending" && (
                    <>
                      <DropdownMenuItem onClick={() => handleApprove(appointment._id)}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCancel(appointment._id)}>
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Decline
                      </DropdownMenuItem>
                    </>
                  )}
                  {appointment.status === "approved" && appointment.appointmentDate <= now && (
                    <>
                      <DropdownMenuItem onClick={() => handleComplete(appointment._id)}>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNoShow(appointment._id)}>
                        <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                        Mark No-Show
                      </DropdownMenuItem>
                    </>
                  )}
                  {appointment.status !== "cancelled" && appointment.status !== "completed" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCancel(appointment._id)}>
                        <XCircle className="h-4 w-4 mr-2 text-red-600" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="My Appointments"
        description="Manage your patient appointments"
      >
        <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
          <Link href="/staff-portal/availability">
            <Clock className="mr-2 h-4 w-4" />
            Set Availability
          </Link>
        </Button>
      </PageHeader>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by patient name or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10">
                <Calendar className="h-5 w-5 text-brand-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{todayAppointments.length}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
                <AlertCircle className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{pendingAppointments.length}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-eucalyptus/10">
                <Clock className="h-5 w-5 text-brand-eucalyptus" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{upcomingAppointments.length}</p>
                <p className="text-xs text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">
                  {appointments?.filter(a => a.status === "completed").length || 0}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appointments Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 sm:w-auto sm:inline-grid">
            <TabsTrigger value="today">
              Today ({todayAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-3 sm:space-y-4">
            {filterAppointments(todayAppointments).length > 0 ? (
              filterAppointments(todayAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No appointments today</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3 sm:space-y-4">
            {filterAppointments(pendingAppointments).length > 0 ? (
              filterAppointments(pendingAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">All caught up!</h3>
                  <p className="text-sm text-gray-500">No pending appointments to review</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4">
            {filterAppointments(upcomingAppointments).length > 0 ? (
              filterAppointments(upcomingAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No upcoming appointments</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-3 sm:space-y-4">
            {filterAppointments(pastAppointments).length > 0 ? (
              filterAppointments(pastAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No past appointments</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

