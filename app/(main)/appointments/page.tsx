'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  Loader2,
  Search,
  Filter,
  Info,
  Heart,
  Building2,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { useQuery, useMutation } from 'convex/react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type BookingStep = 'date' | 'time' | 'details' | 'confirm';

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending Approval' },
  approved: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Approved' },
  confirmed: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Confirmed' },
  completed: { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: CheckCircle2, label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle, label: 'Cancelled' },
  rescheduled: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: CalendarIcon, label: 'Rescheduled' },
  no_show: { color: 'bg-red-100 text-red-600 border-red-200', icon: XCircle, label: 'No Show' },
};

const appointmentTypes = [
  { value: 'consultation', label: 'General Consultation', icon: Stethoscope, description: 'Meet with a doctor for health concerns' },
  { value: 'follow_up', label: 'Follow-up Visit', icon: CalendarCheck, description: 'Continue treatment or check progress' },
  { value: 'routine_checkup', label: 'Routine Checkup', icon: Heart, description: 'Regular health examination' },
  { value: 'emergency', label: 'Urgent Care', icon: AlertCircle, description: 'For pressing health issues' },
  { value: 'telemedicine', label: 'Telemedicine', icon: User, description: 'Virtual consultation from home' },
  { value: 'specialist_referral', label: 'Specialist Referral', icon: Building2, description: 'See a specialized doctor' },
];

export default function AppointmentsPage() {
  const { user, isSignedIn } = useUser();
  const [bookingStep, setBookingStep] = useState<BookingStep>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ startTime: string; timestamp: number } | null>(null);
  const [appointmentType, setAppointmentType] = useState<string>('consultation');
  const [reason, setReason] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBookingPanel, setShowBookingPanel] = useState(false);

  // Get current user from Convex
  const currentUser = useQuery(
    api.users.getCurrentUser,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Get user's appointments
  const userAppointments = useQuery(
    api.appointments.getPatientAppointmentsWithStaff,
    currentUser ? { patientId: currentUser._id } : "skip"
  );

  // Get clinic-wide available slots for selected date
  const availableSlots = useQuery(
    api.appointments.getClinicAvailableSlots,
    selectedDate ? { date: selectedDate.getTime(), appointmentDuration: 30 } : "skip"
  );

  // Mutations
  const createAppointmentWithAutoAssign = useMutation(api.appointments.createAppointmentWithAutoAssign);
  const cancelAppointment = useMutation(api.appointments.cancelAppointment);
  const confirmAppointment = useMutation(api.appointments.confirmAppointment);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    if (!userAppointments) return [];
    
    return userAppointments.filter(apt => {
      const staffName = `${apt.staffUser?.firstName || ''} ${apt.staffUser?.lastName || ''}`.toLowerCase();
      const specialty = apt.staffProfile?.specialty?.toLowerCase() || '';
      const matchesSearch = staffName.includes(searchQuery.toLowerCase()) || 
                           specialty.includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [userAppointments, searchQuery, filterStatus]);

  // Format helpers
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Handle booking
  const handleBookAppointment = async () => {
    if (!currentUser || !selectedDate || !selectedTimeSlot) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsBooking(true);
    try {
      const result = await createAppointmentWithAutoAssign({
        patientId: currentUser._id,
        appointmentDate: selectedTimeSlot.timestamp,
        duration: 30,
        appointmentType: appointmentType as any,
        reason: reason || undefined,
        createdById: currentUser._id,
      });

      toast.success('Appointment booked successfully! Waiting for approval.');
      
      // Reset form
      setSelectedDate(undefined);
      setSelectedTimeSlot(null);
      setAppointmentType('consultation');
      setReason('');
      setBookingStep('date');
      setShowBookingPanel(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: Id<"appointments">) => {
    if (!currentUser) return;
    try {
      await cancelAppointment({
        appointmentId,
        cancelledBy: currentUser._id,
        cancellationReason: 'Cancelled by patient',
      });
      toast.success('Appointment cancelled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel appointment');
    }
  };

  const handleConfirmAppointment = async (appointmentId: Id<"appointments">) => {
    if (!currentUser) return;
    try {
      await confirmAppointment({
        appointmentId,
        confirmedBy: currentUser._id,
      });
      toast.success('Appointment confirmed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm appointment');
    }
  };

  const goToStep = (step: BookingStep) => {
    setBookingStep(step);
  };

  const canProceedFromDate = !!selectedDate;
  const canProceedFromTime = !!selectedTimeSlot;
  const canProceedFromDetails = !!appointmentType;

  // Categorize time slots
  const categorizedSlots = useMemo(() => {
    if (!availableSlots) return { morning: [], afternoon: [], evening: [] };
    
    return availableSlots.reduce((acc, slot) => {
      if (!slot.isAvailable) return acc;
      
      const hour = parseInt(slot.startTime.split(':')[0]);
      if (hour < 12) {
        acc.morning.push(slot);
      } else if (hour < 17) {
        acc.afternoon.push(slot);
      } else {
        acc.evening.push(slot);
      }
      return acc;
    }, { morning: [] as typeof availableSlots, afternoon: [] as typeof availableSlots, evening: [] as typeof availableSlots });
  }, [availableSlots]);

  return (
    <div className="min-h-screen py-20 lg:py-24 bg-gradient-to-br from-brand-sky/5 via-white to-brand-teal/5">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge variant="secondary" className="mb-4 bg-brand-teal/10 text-brand-teal border-brand-teal/20">
            <CalendarCheck className="w-3 h-3 mr-1" />
            Healthcare Made Simple
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-4">
            Manage Your Appointments
          </h1>
          <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg">
            Book appointments with our healthcare professionals. Select a time that works for you, 
            and we'll match you with an available medical specialist.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointments List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-brand-navy">Your Appointments</CardTitle>
                    <CardDescription>View and manage your upcoming visits</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowBookingPanel(!showBookingPanel)}
                    className="lg:hidden bg-brand-orange hover:bg-brand-orange/90"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Book New
                  </Button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by doctor or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm min-w-[150px]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent>
                {!isSignedIn ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Sign in to view your appointments</p>
                    <SignInButton mode="modal">
                      <Button variant="outline">Sign In</Button>
                    </SignInButton>
                  </div>
                ) : !userAppointments ? (
                  <div className="py-12 flex justify-center">
                    <Loader size="md" text="Loading appointments..." />
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">
                      {userAppointments.length === 0
                        ? "You don't have any appointments yet"
                        : 'No appointments match your filters'}
                    </p>
                    {userAppointments.length === 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowBookingPanel(true)}
                        className="mt-2"
                      >
                        Book Your First Appointment
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {filteredAppointments.map((apt, index) => {
                        const status = statusConfig[apt.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        
                        return (
                          <motion.div
                            key={apt._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative p-4 rounded-xl border border-gray-100 hover:border-brand-teal/30 hover:shadow-md transition-all bg-white"
                          >
                            <div className="flex items-start gap-4">
                              {/* Date Badge */}
                              <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] h-[60px] rounded-lg bg-brand-navy/5 text-brand-navy">
                                <span className="text-xs uppercase font-medium">
                                  {new Date(apt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-xl font-bold">
                                  {new Date(apt.appointmentDate).getDate()}
                                </span>
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-brand-navy">
                                      {apt.staffProfile?.role === 'doctor' ? 'Dr. ' : ''}
                                      {apt.staffUser?.firstName} {apt.staffUser?.lastName}
                                    </h3>
                                    <p className="text-sm text-brand-teal">
                                      {apt.staffProfile?.specialty || 'General Practice'}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className={cn("text-xs", status.color)}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {status.label}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-3.5 h-3.5" />
                                    {formatDate(apt.appointmentDate)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatTime(apt.appointmentDate)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {apt.location || 'Main Clinic'}
                                  </span>
                                </div>

                                {apt.reason && (
                                  <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                                    <span className="font-medium">Reason:</span> {apt.reason}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                              {apt.status === 'approved' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmAppointment(apt._id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Confirm
                                </Button>
                              )}
                              {['pending', 'approved', 'confirmed'].includes(apt.status) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelAppointment(apt._id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "lg:block",
              showBookingPanel ? "block" : "hidden"
            )}
          >
            <Card className="border-gray-100 shadow-sm sticky top-24">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-xl text-brand-navy flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-brand-teal" />
                  Book Appointment
                </CardTitle>
                <CardDescription>
                  Select a date and time that works for you
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {!isSignedIn ? (
                  <div className="text-center py-8">
                    <User className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-4">Please sign in to book an appointment</p>
                    <SignInButton mode="modal">
                      <Button className="bg-brand-orange hover:bg-brand-orange/90">
                        Sign In to Book
                      </Button>
                    </SignInButton>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-between text-xs font-medium">
                      {['date', 'time', 'details', 'confirm'].map((step, idx) => (
                        <div
                          key={step}
                          className={cn(
                            "flex items-center gap-1.5",
                            bookingStep === step ? "text-brand-teal" : 
                            ['date', 'time', 'details', 'confirm'].indexOf(bookingStep) > idx ? "text-green-600" : "text-gray-400"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]",
                            bookingStep === step ? "bg-brand-teal" :
                            ['date', 'time', 'details', 'confirm'].indexOf(bookingStep) > idx ? "bg-green-500" : "bg-gray-300"
                          )}>
                            {['date', 'time', 'details', 'confirm'].indexOf(bookingStep) > idx ? '✓' : idx + 1}
                          </div>
                          <span className="hidden sm:inline capitalize">{step}</span>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Step 1: Date Selection */}
                      {bookingStep === 'date' && (
                        <motion.div
                          key="date"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <Label className="text-sm font-medium">Select Date</Label>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setSelectedTimeSlot(null);
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            className="rounded-lg border"
                          />
                          <Button
                            onClick={() => goToStep('time')}
                            disabled={!canProceedFromDate}
                            className="w-full bg-brand-teal hover:bg-brand-teal/90"
                          >
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 2: Time Selection */}
                      {bookingStep === 'time' && (
                        <motion.div
                          key="time"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              Available Times for {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => goToStep('date')}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Back
                            </Button>
                          </div>

                          {!availableSlots ? (
                            <div className="py-8 flex justify-center">
                              <Loader size="sm" text="Loading available times..." />
                            </div>
                          ) : availableSlots.filter(s => s.isAvailable).length === 0 ? (
                            <div className="py-8 text-center">
                              <Clock className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                              <p className="text-gray-500 text-sm">No available slots for this date</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => goToStep('date')}
                              >
                                Choose Another Date
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                              {categorizedSlots.morning.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2">Morning</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {categorizedSlots.morning.map((slot) => (
                                      <button
                                        key={slot.startTime}
                                        onClick={() => setSelectedTimeSlot({ startTime: slot.startTime, timestamp: slot.timestamp })}
                                        className={cn(
                                          "p-2 text-xs rounded-lg border transition-all",
                                          selectedTimeSlot?.startTime === slot.startTime
                                            ? "border-brand-teal bg-brand-teal text-white"
                                            : "border-gray-200 hover:border-brand-teal/50 hover:bg-brand-teal/5"
                                        )}
                                      >
                                        {formatTimeSlot(slot.startTime)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {categorizedSlots.afternoon.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2">Afternoon</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {categorizedSlots.afternoon.map((slot) => (
                                      <button
                                        key={slot.startTime}
                                        onClick={() => setSelectedTimeSlot({ startTime: slot.startTime, timestamp: slot.timestamp })}
                                        className={cn(
                                          "p-2 text-xs rounded-lg border transition-all",
                                          selectedTimeSlot?.startTime === slot.startTime
                                            ? "border-brand-teal bg-brand-teal text-white"
                                            : "border-gray-200 hover:border-brand-teal/50 hover:bg-brand-teal/5"
                                        )}
                                      >
                                        {formatTimeSlot(slot.startTime)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {categorizedSlots.evening.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-2">Evening</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    {categorizedSlots.evening.map((slot) => (
                                      <button
                                        key={slot.startTime}
                                        onClick={() => setSelectedTimeSlot({ startTime: slot.startTime, timestamp: slot.timestamp })}
                                        className={cn(
                                          "p-2 text-xs rounded-lg border transition-all",
                                          selectedTimeSlot?.startTime === slot.startTime
                                            ? "border-brand-teal bg-brand-teal text-white"
                                            : "border-gray-200 hover:border-brand-teal/50 hover:bg-brand-teal/5"
                                        )}
                                      >
                                        {formatTimeSlot(slot.startTime)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <Button
                            onClick={() => goToStep('details')}
                            disabled={!canProceedFromTime}
                            className="w-full bg-brand-teal hover:bg-brand-teal/90"
                          >
                            Continue
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 3: Details */}
                      {bookingStep === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Appointment Details</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => goToStep('time')}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Back
                            </Button>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-xs text-gray-500">Type of Visit</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto">
                              {appointmentTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                  <button
                                    key={type.value}
                                    onClick={() => setAppointmentType(type.value)}
                                    className={cn(
                                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                                      appointmentType === type.value
                                        ? "border-brand-teal bg-brand-teal/5"
                                        : "border-gray-200 hover:border-gray-300"
                                    )}
                                  >
                                    <Icon className={cn(
                                      "w-5 h-5 mt-0.5",
                                      appointmentType === type.value ? "text-brand-teal" : "text-gray-400"
                                    )} />
                                    <div>
                                      <p className={cn(
                                        "text-sm font-medium",
                                        appointmentType === type.value ? "text-brand-teal" : "text-gray-700"
                                      )}>
                                        {type.label}
                                      </p>
                                      <p className="text-xs text-gray-500">{type.description}</p>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Reason for Visit (Optional)</Label>
                            <Textarea
                              placeholder="Briefly describe your symptoms or concerns..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              rows={3}
                              className="resize-none"
                            />
                          </div>

                          <Button
                            onClick={() => goToStep('confirm')}
                            disabled={!canProceedFromDetails}
                            className="w-full bg-brand-teal hover:bg-brand-teal/90"
                          >
                            Review Booking
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </motion.div>
                      )}

                      {/* Step 4: Confirmation */}
                      {bookingStep === 'confirm' && (
                        <motion.div
                          key="confirm"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Confirm Booking</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => goToStep('details')}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Back
                            </Button>
                          </div>

                          <div className="p-4 rounded-lg bg-gray-50 space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="w-4 h-4 text-brand-teal" />
                              <span className="font-medium">
                                {selectedDate?.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-brand-teal" />
                              <span className="font-medium">
                                {selectedTimeSlot && formatTimeSlot(selectedTimeSlot.startTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Stethoscope className="w-4 h-4 text-brand-teal" />
                              <span className="font-medium">
                                {appointmentTypes.find(t => t.value === appointmentType)?.label}
                              </span>
                            </div>
                            {reason && (
                              <div className="pt-2 border-t text-sm">
                                <p className="text-gray-500 text-xs mb-1">Reason:</p>
                                <p className="text-gray-700">{reason}</p>
                              </div>
                            )}
                          </div>

                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="flex gap-2">
                              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-blue-700">
                                Your appointment will be assigned to an available medical professional. 
                                You'll receive confirmation once approved.
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={handleBookAppointment}
                            disabled={isBooking}
                            className="w-full bg-brand-orange hover:bg-brand-orange/90"
                          >
                            {isBooking ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirm Booking
                              </>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="mt-6 border-brand-teal/20 bg-brand-teal/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-brand-teal" />
                  Appointment Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs flex-shrink-0">1</span>
                    Arrive 15 minutes before your appointment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs flex-shrink-0">2</span>
                    Bring your ID and insurance card
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs flex-shrink-0">3</span>
                    List your current medications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-xs flex-shrink-0">4</span>
                    Prepare questions for your doctor
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
