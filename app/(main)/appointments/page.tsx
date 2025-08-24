'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, MapPin, User, Search, Filter } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import Lifeline from '@/components/ui/Lifeline';
import Loader from '@/components/ui/Loader';

const appointments = [
  {
    id: 1,
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    date: '2024-03-20',
    time: '10:00 AM',
    location: 'Main Clinic, Room 204',
    status: 'upcoming',
  },
  {
    id: 2,
    doctor: 'Dr. Michael Chen',
    specialty: 'Pediatrician',
    date: '2024-03-25',
    time: '2:30 PM',
    location: 'Children\'s Wing, Room 105',
    status: 'upcoming',
  },
  {
    id: 3,
    doctor: 'Dr. Emily Rodriguez',
    specialty: 'Neurologist',
    date: '2024-04-02',
    time: '1:15 PM',
    location: 'Neurology Center, Room 310',
    status: 'upcoming',
  },
  {
    id: 4,
    doctor: 'Dr. James Wilson',
    specialty: 'Dermatologist',
    date: '2024-04-10',
    time: '9:45 AM',
    location: 'Dermatology Wing, Room 122',
    status: 'upcoming',
  },
];

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  
  // Handle scheduling action
  const handleSchedule = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  // Filter appointments based on search query and specialty filter
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appointment.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = filterSpecialty === 'all' || appointment.specialty === filterSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });
  
  // Get unique specialties for filter dropdown
  const specialties = Array.from(new Set(appointments.map(apt => apt.specialty)));

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
              
              {filteredAppointments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No appointments found matching your search criteria.</p>
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
                      key={appointment.id}
                      variants={itemVariants}
                      className="border border-green-light rounded-lg p-4 hover:shadow-md transition-shadow bg-card relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{appointment.doctor}</h3>
                          <p className="text-primary">{appointment.specialty}</p>
                          <div className="mt-2 space-y-1 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-primary" />
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-primary" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Reschedule</Button>
                          <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">Cancel</Button>
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
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Book New Appointment</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor-type">Doctor Specialty</Label>
                  <select
                    id="doctor-type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">Select a specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border border-green-light"
                    disabled={(date) => {
                      // Disable past dates and weekends
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      return date < now || day === 0 || day === 6;
                    }}
                  />
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Loader size="sm" text="Finding available slots..." />
                  </div>
                ) : (
                  <Button 
                    className="w-full btn-primary"
                    onClick={handleSchedule}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Check Available Times
                  </Button>
                )}
              </div>
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