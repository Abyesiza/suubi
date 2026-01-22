"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Stethoscope,
  XCircle,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function PatientAppointmentsPage() {
  const { user } = useUser();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Fetch appointments with staff info
  const appointments = useQuery(
    api.appointments.getPatientAppointmentsWithStaff,
    currentUser?._id ? { patientId: currentUser._id, limit: 100 } : "skip"
  );

  // Mutations
  const cancelAppointment = useMutation(api.appointments.cancelAppointmentByPatient);

  // Loading state
  if (currentUser === undefined || appointments === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleCancelAppointment = async (appointmentId: string, reason: string) => {
    if (!currentUser) return;
    try {
      await cancelAppointment({
        appointmentId: appointmentId as any,
        patientId: currentUser._id,
        cancellationReason: reason,
      });
      toast.success("Appointment cancelled successfully");
      setSelectedAppointment(null);
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  // Filter appointments
  const now = Date.now();
  const upcomingAppointments = appointments?.filter(
    (apt) => apt.appointmentDate >= now && !["cancelled", "completed", "no_show"].includes(apt.status)
  ) || [];
  
  const pastAppointments = appointments?.filter(
    (apt) => apt.appointmentDate < now || ["completed", "no_show"].includes(apt.status)
  ) || [];
  
  const cancelledAppointments = appointments?.filter(
    (apt) => apt.status === "cancelled"
  ) || [];

  // Search filter
  const filterAppointments = (apps: any[]) => {
    if (!searchQuery) return apps;
    return apps.filter(apt => 
      apt.staffUser?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.staffUser?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            {/* Doctor Avatar & Info */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white shadow-sm">
                <AvatarImage
                  src={appointment.staffProfile?.profileImage || appointment.staffUser?.imageUrl}
                  alt={appointment.staffUser?.firstName || "Doctor"}
                />
                <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                  <Stethoscope className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brand-navy text-base sm:text-lg truncate">
                  {appointment.staffUser ? `Dr. ${appointment.staffUser.firstName} ${appointment.staffUser.lastName}` : "Pending Assignment"}
                </h3>
                {appointment.staffProfile?.specialty && (
                  <p className="text-sm text-gray-500 capitalize truncate">
                    {appointment.staffProfile.specialty}
                  </p>
                )}
                <div className="mt-2">
                  <StatusBadge status={appointment.status} />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">
                  {format(new Date(appointment.appointmentDate), "EEEE, MMMM d, yyyy")}
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
              {appointment.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 truncate">{appointment.location}</span>
                </div>
              )}
              {appointment.reason && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 line-clamp-2">{appointment.reason}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                    <DialogDescription>
                      Review your appointment information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4 pb-4 border-b">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarImage
                          src={appointment.staffProfile?.profileImage || appointment.staffUser?.imageUrl}
                          alt={appointment.staffUser?.firstName || "Doctor"}
                        />
                        <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                          <Stethoscope className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-brand-navy">
                          {appointment.staffUser ? `Dr. ${appointment.staffUser.firstName} ${appointment.staffUser.lastName}` : "Pending Assignment"}
                        </h3>
                        {appointment.staffProfile?.specialty && (
                          <p className="text-sm text-gray-500 capitalize">
                            {appointment.staffProfile.specialty}
                          </p>
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
                        <label className="text-sm font-medium text-gray-500">Duration</label>
                        <p className="text-brand-navy font-medium mt-1">
                          {appointment.duration || 30} minutes
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <div className="mt-1">
                          <StatusBadge status={appointment.status} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type</label>
                        <p className="text-brand-navy font-medium mt-1 capitalize">
                          {appointment.appointmentType?.replace("_", " ") || "Consultation"}
                        </p>
                      </div>
                    </div>

                    {appointment.location && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-brand-navy mt-1">{appointment.location}</p>
                      </div>
                    )}

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
                            <Badge key={index} variant="secondary">
                              {symptom}
                            </Badge>
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
                  </div>
                </DialogContent>
              </Dialog>

              {appointment.status !== "cancelled" && appointment.status !== "completed" && appointment.appointmentDate > now && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Cancel</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancelAppointment(appointment._id, "Cancelled by patient")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, Cancel Appointment
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
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
        description="View and manage all your appointments"
      >
        <Button asChild className="bg-brand-navy hover:bg-brand-navy/90">
          <Link href="/booking">
            <Calendar className="mr-2 h-4 w-4" />
            Book New
          </Link>
        </Button>
      </PageHeader>

      {/* Search and Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by doctor or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-teal/10">
                <Calendar className="h-5 w-5 text-brand-teal" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-eucalyptus/10">
                <CheckCircle className="h-5 w-5 text-brand-eucalyptus" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{appointments?.filter(a => a.status === "completed").length || 0}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-amber/10">
                <Clock className="h-5 w-5 text-brand-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{appointments?.filter(a => a.status === "pending").length || 0}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{cancelledAppointments.length}</p>
                <p className="text-xs text-gray-500">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appointments Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-3 sm:space-y-4">
            {filterAppointments(upcomingAppointments).length > 0 ? (
              filterAppointments(upcomingAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No upcoming appointments
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Book an appointment to get started with your healthcare journey
                  </p>
                  <Button asChild className="bg-brand-teal hover:bg-brand-teal/90">
                    <Link href="/booking">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Link>
                  </Button>
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

          <TabsContent value="cancelled" className="space-y-3 sm:space-y-4">
            {filterAppointments(cancelledAppointments).length > 0 ? (
              filterAppointments(cancelledAppointments).map((apt) => (
                <AppointmentCard key={apt._id} appointment={apt} />
              ))
            ) : (
              <Card className="shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">No cancelled appointments</h3>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

