'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, MapPin, User, Search, Filter, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import Lifeline from '@/components/ui/Lifeline';
import Loader from '@/components/ui/Loader';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
      case 'approved':
        return { color: 'bg-blue-100 text-blue-800', icon: CheckCircle };
      case 'confirmed':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'completed':
        return { color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: XCircle };
      case 'rescheduled':
        return { color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
      case 'no_show':
        return { color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function AppointmentsPage() {
  const { user } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('consultation');
  const [reason, setReason] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('');

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, { 
    clerkId: user?.id 
  });

  // Get user's appointments
  const userAppointments = useQuery(api.appointments.getPatientAppointmentsWithStaff, 
    currentUser ? { patientId: currentUser._id } : "skip"
  );

  // Get available doctors
  const availableDoctors = useQuery(api.staffProfiles.getAvailableDoctors);

  // Get available time slots for selected doctor and date
  const selectedDoctorUser = availableDoctors?.find(doctor => doctor.staffProfile._id === selectedDoctor)?.user;
  const availableTimeSlots = useQuery(
    api.staffProfiles.getStaffAvailableTimes,
    selectedDoctorUser && date && showBookingForm ? {
      staffUserId: selectedDoctorUser._id,
      date: date.getTime()
    } : "skip"
  );

  // Mutations
  const createAppointment = useMutation(api.appointments.createAppointment);
  const cancelAppointment = useMutation(api.appointments.cancelAppointment);
  const confirmAppointment = useMutation(api.appointments.confirmAppointment);
  // Removed createSampleAvailableTimes mutation

  // Filter appointments based on search query and specialty filter
  const filteredAppointments = userAppointments?.filter(appointment => {
    if (!appointment) return false;
    
    const doctorName = `${appointment.staffUser?.firstName || ''} ${appointment.staffUser?.lastName || ''}`.toLowerCase();
    const specialty = appointment.staffProfile?.specialty?.toLowerCase() || '';
    const location = appointment.location?.toLowerCase() || '';
    
    const matchesSearch = doctorName.includes(searchQuery.toLowerCase()) || 
                          specialty.includes(searchQuery.toLowerCase()) ||
                          location.includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = filterSpecialty === 'all' || specialty === filterSpecialty.toLowerCase();
    
    return matchesSearch && matchesSpecialty;
  }) || [];
  
  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(
    availableDoctors?.map(doctor => doctor.staffProfile.specialty).filter(Boolean) || []
  ));

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!currentUser || !selectedDoctor || !date || !selectedTimeSlot) {
      toast.error('Please fill in all required fields including time slot');
      return;
    }

    setIsLoading(true);
    try {
      const appointmentDate = new Date(date);
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);

      await createAppointment({
        patientId: currentUser._id,
        staffProfileId: selectedDoctor as Id<"staff_profiles">,
        appointmentDate: appointmentDate.getTime(),
        duration: 30,
        appointmentType: appointmentType as any,
        reason: reason || undefined,
        createdById: currentUser._id,
      });

      toast.success('Appointment booked successfully!');
      setShowBookingForm(false);
      setSelectedDoctor('');
      setSelectedTimeSlot('');
      setPreferredTime('');
      setReason('');
      setDate(new Date());
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: Id<"appointments">) => {
    if (!currentUser) return;

    try {
      await cancelAppointment({
        appointmentId,
        cancelledBy: currentUser._id,
        cancellationReason: 'Cancelled by patient',
      });
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  // Handle appointment confirmation
  const handleConfirmAppointment = async (appointmentId: Id<"appointments">) => {
    if (!currentUser) return;

    try {
      await confirmAppointment({
        appointmentId,
        confirmedBy: currentUser._id,
      });
      toast.success('Appointment confirmed successfully');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  // Removed handler for creating sample available times

  // Helper function to convert time string to minutes
  const timeStringToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-foreground">Manage Your Appointments</h1>
          <div className="w-48 h-6 mx-auto mb-4">
            <Lifeline color="#FF9933" height="12px" variant="minimal" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Schedule and track your medical appointments with our healthcare professionals.
          </p>
        </motion.div>

        {/* Removed sample data button */}

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 border-green-light">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-foreground">Upcoming Appointments</h2>
                
                {/* Search and Filter - NEW */}
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search appointments..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative">
                    <select
                      className="w-full md:w-[150px] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                    >
                      <option value="all">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {!userAppointments ? (
                <div className="py-8 text-center">
                  <Loader size="md" text="Loading appointments..." />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {userAppointments.length === 0 
                      ? "You don't have any appointments yet." 
                      : "No appointments found matching your search criteria."
                    }
                  </p>
                  {userAppointments.length > 0 && (
                  <Button
                    variant="link"
                    className="mt-2 text-primary"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterSpecialty('all');
                    }}
                  >
                    Clear filters
                  </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredAppointments.map((appointment) => (
                    <motion.div
                      key={appointment._id}
                      variants={itemVariants}
                      className="border border-green-light rounded-lg p-4 hover:shadow-md transition-shadow bg-card relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">
                              Dr. {appointment.staffUser?.firstName} {appointment.staffUser?.lastName}
                            </h3>
                            <StatusBadge status={appointment.status} />
                          </div>
                          <p className="text-primary mb-2">{appointment.staffProfile?.specialty || 'General Practice'}</p>
                          <div className="mt-2 space-y-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-primary" />
                              <span>{formatDate(appointment.appointmentDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{formatTime(appointment.appointmentDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{appointment.location || 'Main Clinic'}</span>
                            </div>
                            {appointment.reason && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  <strong>Reason:</strong> {appointment.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {appointment.status === 'approved' && (
                            <Button 
                              variant="outline" 
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => handleConfirmAppointment(appointment._id)}
                            >
                              Confirm
                            </Button>
                          )}
                          {appointment.status === 'pending' && (
                            <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                              Pending Approval
                            </Button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                              Confirmed
                            </Button>
                          )}
                          {appointment.status === 'completed' && (
                            <Button variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50">
                              Completed
                            </Button>
                          )}
                          {['pending', 'approved', 'confirmed'].includes(appointment.status) && (
                            <Button 
                              variant="outline" 
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleCancelAppointment(appointment._id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Small lifeline at the bottom of each appointment card */}
                      <div className="absolute bottom-0 left-0 right-0 h-4">
                        <Lifeline 
                          color="#FF9933" 
                          height="8px" 
                          variant="minimal" 
                          className="opacity-30"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 border-green-light">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Book New Appointment</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {showBookingForm ? 'Cancel' : 'New Booking'}
                </Button>
              </div>

              

              {/* Booking Form - Only visible when showBookingForm is true */}
              {showBookingForm ? (
              <div className="space-y-4">

                  {/* Doctor Selection - inside booking form */}
                  <div className="grid gap-2">
                    <Label htmlFor="doctor-select">Select Doctor</Label>
                    <select
                      id="doctor-select"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      value={selectedDoctor}
                      onChange={(e) => {
                        setSelectedDoctor(e.target.value);
                        setSelectedTimeSlot(''); // Reset time slot when doctor changes
                        setPreferredTime(''); // Reset preferred time when doctor changes
                      }}
                    >
                      <option value="">Select a doctor</option>
                      {availableDoctors?.map(doctor => (
                        <option key={doctor.staffProfile._id} value={doctor.staffProfile._id}>
                          Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.staffProfile.specialty || 'General Practice'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Slot Selection - inside booking form */}
                  {selectedDoctor && date && (
                    <div className="grid gap-2">
                      <Label>Select Time Slot</Label>
                      {!availableTimeSlots ? (
                        <div className="flex justify-center py-4">
                          <Loader size="sm" text="Loading available times..." />
                        </div>
                      ) : availableTimeSlots.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No available time slots for this doctor on the selected date.</p>
                          <p className="text-sm mt-1">This doctor may not have set up their availability schedule yet.</p>
                          <p className="text-sm">Please try a different date or doctor.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                          {(() => {
                            // Generate 30-minute slots from available time ranges
                            const generatedSlots: Array<{startTime: string, endTime: string, isPreferred: boolean}> = [];
                            
                            availableTimeSlots
                              .filter(slot => slot.isAvailable !== false)
                              .forEach(slot => {
                                const slotStartTime = timeStringToMinutes(slot.startTime);
                                const slotEndTime = timeStringToMinutes(slot.endTime);
                                
                                // Generate 30-minute slots within this time range
                                for (let time = slotStartTime; time + 30 <= slotEndTime; time += 30) {
                                  const startTimeStr = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;
                                  const endTimeStr = `${Math.floor((time + 30) / 60).toString().padStart(2, '0')}:${((time + 30) % 60).toString().padStart(2, '0')}`;
                                  
                                  const isPreferred = !!(preferredTime && 
                                    Math.abs(time - timeStringToMinutes(preferredTime)) <= 30);
                                  
                                  generatedSlots.push({
                                    startTime: startTimeStr,
                                    endTime: endTimeStr,
                                    isPreferred
                                  });
                                }
                              });

                            // Dedupe overlapping ranges that produce the same 30-min slot
                            const seenKeys = new Set<string>();
                            const uniqueSlots = generatedSlots.filter((slot) => {
                              const key = `${slot.startTime}-${slot.endTime}`;
                              if (seenKeys.has(key)) return false;
                              seenKeys.add(key);
                              return true;
                            });
                            
                            // Sort by preferred time if set, otherwise by time
                            uniqueSlots.sort((a, b) => {
                              if (preferredTime) {
                                const preferredMinutes = timeStringToMinutes(preferredTime);
                                const aMinutes = timeStringToMinutes(a.startTime);
                                const bMinutes = timeStringToMinutes(b.startTime);
                                const aDiff = Math.abs(aMinutes - preferredMinutes);
                                const bDiff = Math.abs(bMinutes - preferredMinutes);
                                return aDiff - bDiff;
                              }
                              return a.startTime.localeCompare(b.startTime);
                            });
                            
                            return uniqueSlots.map((slot) => (
                              <button
                                key={`${slot.startTime}-${slot.endTime}`}
                                type="button"
                                className={`p-3 rounded-md border text-sm transition-colors relative ${
                                  selectedTimeSlot === slot.startTime
                                    ? 'border-primary bg-primary text-white'
                                    : slot.isPreferred
                                    ? 'border-green-500 bg-green-50 hover:border-green-600'
                                    : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                                }`}
                                onClick={() => setSelectedTimeSlot(slot.startTime)}
                              >
                                <div className="font-medium">{slot.startTime}</div>
                                <div className="text-xs opacity-75">{slot.endTime}</div>
                                {slot.isPreferred && (
                                  <div className="absolute top-1 right-1 text-xs text-green-600 font-bold">
                                    ★
                                  </div>
                                )}
                              </button>
                            ));
                          })()}
                        </div>
                      )}
                      
                      {availableTimeSlots && availableTimeSlots.length > 0 && (
                        <div className="text-sm text-muted-foreground text-center mt-2">
                          {(() => {
                            const generatedSlotsCount = availableTimeSlots
                              .filter(slot => slot.isAvailable !== false)
                              .reduce((total, slot) => {
                                const slotStartTime = timeStringToMinutes(slot.startTime);
                                const slotEndTime = timeStringToMinutes(slot.endTime);
                                const slotsInRange = Math.floor((slotEndTime - slotStartTime) / 30);
                                return total + slotsInRange;
                              }, 0);
                            return `Showing ${generatedSlotsCount} available time slots`;
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="appointment-type">Appointment Type</Label>
                    <select
                      id="appointment-type"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="routine_checkup">Routine Checkup</option>
                      <option value="emergency">Emergency</option>
                      <option value="specialist_referral">Specialist Referral</option>
                      <option value="telemedicine">Telemedicine</option>
                      <option value="in_person">In-Person</option>
                  </select>
                </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                    <Input
                      id="reason"
                      placeholder="Brief description of your symptoms or concerns"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                
                <div className="grid gap-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setSelectedTimeSlot(''); // Reset time slot when date changes
                        setPreferredTime(''); // Reset preferred time when date changes
                      }}
                    className="rounded-md border border-green-light"
                    disabled={(date) => {
                        // Only disable past dates - hospitals work 24/7
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                        return date < now;
                    }}
                  />
                </div>

                  {/* Preferred Time Input */}
                  {selectedDoctor && date && (
                    <div className="grid gap-2">
                      <Label htmlFor="preferred-time">Preferred Time (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="preferred-time"
                          type="time"
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          placeholder="Select your preferred time"
                        />
                        <span className="text-sm text-muted-foreground">
                          We'll try to match this time
                        </span>
                      </div>
                    </div>
                  )}
                
                {isLoading ? (
                  <div className="flex justify-center py-2">
                      <Loader size="sm" text="Booking appointment..." />
                  </div>
                ) : (
                  <Button 
                    className="w-full btn-primary"
                      onClick={handleBookAppointment}
                      disabled={!selectedDoctor || !date || !selectedTimeSlot}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Ready to book your next appointment?
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowBookingForm(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Start Booking
                  </Button>
                </div>
                )}
            </Card>
            
            {/* Health Tips Card - NEW */}
            <Card className="mt-6 p-6 border-green-light bg-[hsl(var(--suubi-green-50))] bg-opacity-30">
              <h3 className="text-lg font-semibold mb-3 text-foreground">Appointment Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs mt-0.5">1</span>
                  <span>Arrive 15 minutes before your scheduled appointment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs mt-0.5">2</span>
                  <span>Bring your insurance card and ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs mt-0.5">3</span>
                  <span>List any medications you're currently taking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs mt-0.5">4</span>
                  <span>Write down any questions you have for the doctor</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}