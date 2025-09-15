'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Mail, Calendar, Phone, Award, ThumbsUp, RefreshCw } from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function DoctorsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  
  const router = useRouter();
  const { user: clerkUser } = useUser();

  // Fetch all doctors from staff profiles
  const doctorsRaw = useQuery(api.staffProfiles.listStaffWithUsers, { 
    role: "doctor" 
  });

  // Get current user from Convex
  const currentUser = useQuery(
    api.users.getCurrentUser,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  // Mutations
  const createRoomWithStaffProfile = useMutation(api.room.createOrGetRoomWithStaffProfile);
  const checkAndFixDatabase = useMutation(api.staffProfiles.checkAndFixDatabaseState);

  const isLoading = doctorsRaw === undefined;
  const doctorsData = doctorsRaw ?? [];

  const doctors = useMemo(() => {
    return doctorsData
      .filter((doctorData: any) => {
        // Filter out entries that don't have both user and staffProfile
        if (!doctorData || !doctorData.user || !doctorData.staffProfile) {
          return false;
        }
        return true;
      })
      .map((doctorData: any) => {
        const { user, staffProfile } = doctorData;

        // Additional safety checks
        if (!user || !staffProfile) {
          return null;
        }

        const firstName = user?.firstName ?? '';
        const lastName = user?.lastName ?? '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Dr. Staff';
        const image = staffProfile?.profileImage || user?.imageUrl || 'https://via.placeholder.com/600x400?text=Doctor';
        const specialty = staffProfile?.specialty || staffProfile?.subRole || 'General Practice';
        const experience = staffProfile?.experience ? `${staffProfile.experience} years` : '—';
        const rating = staffProfile?.rating || 0;
        const bio = staffProfile?.bio || 'Experienced healthcare professional dedicated to providing quality care.';
        const availability = staffProfile?.isAvailable ? 'Available' : 'Not Available';

        return {
          id: String(staffProfile._id), // Use staff profile ID for chat functionality
          userId: String(user._id), // Keep user ID for reference
          name: fullName,
          image,
          specialty: specialty.replace(/_/g, ' '),
          experience,
          rating: rating.toFixed(1),
          bio,
          availability,
          consultationFee: staffProfile?.consultationFee,
          qualifications: staffProfile?.qualifications || [],
          languages: staffProfile?.languages || [],
        };
      })
      .filter((doctor): doctor is NonNullable<typeof doctor> => doctor !== null); // Remove any null entries
  }, [doctorsData]);

  // Handle database fix
  const handleFixDatabase = async () => {
    setIsFixing(true);
    try {
      const result = await checkAndFixDatabase();
      console.log("Database fix result:", result);
      // The page will automatically refresh due to reactive queries
    } catch (error) {
      console.error("Failed to fix database:", error);
    } finally {
      setIsFixing(false);
    }
  };

  // Handle chat button click - create room and navigate to chat
  const handleStartChat = async (staffProfileId: string) => {
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    setIsCreatingRoom(staffProfileId);
    try {
      console.log("Creating room for patient:", {
        patientName: `${currentUser.firstName} ${currentUser.lastName}`,
        patientEmail: currentUser.email,
        staffProfileId
      });

      // Create or get existing room
      const roomId = await createRoomWithStaffProfile({
        patientUserId: currentUser._id,
        staffProfileId: staffProfileId as Id<"staff_profiles">,
      });

      console.log("Room created successfully:", roomId);

      // Navigate to chat page with the room
      router.push(`/chat?staffProfileId=${staffProfileId}`);
    } catch (error) {
      console.error("Failed to create chat room:", error);
    } finally {
      setIsCreatingRoom(null);
    }
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Our Expert Doctors</h1>
          <div className="w-48 h-6 mx-auto mb-4">
            <Lifeline color="#FF9933" height="12px" variant="minimal" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our team of experienced healthcare professionals dedicated to providing you with the highest quality care.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2 text-foreground">No doctors found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden border-green-light h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-12">
                      <Lifeline color="#FF9933" height="20px" variant="thin" className="opacity-60" />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{doctor.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-primary font-medium mb-2">{doctor.specialty}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{doctor.experience} experience</span>
                    </div>

                    {doctor.consultationFee && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-muted-foreground">Consultation Fee:</span>
                        <span className="text-sm font-medium text-primary">${doctor.consultationFee}</span>
                      </div>
                    )}

                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {expandedId === doctor.id ? doctor.bio : `${(doctor.bio || '').substring(0, 80)}...`}
                    </p>

                    <Button
                      variant="link"
                      className="text-primary p-0 h-auto self-start mb-4"
                      onClick={() => setExpandedId(expandedId === doctor.id ? null : doctor.id)}
                    >
                      {expandedId === doctor.id ? 'Show less' : 'Read more'}
                    </Button>

                    {expandedId === doctor.id && (
                      <div className="mb-4 space-y-2">
                        {doctor.qualifications && doctor.qualifications.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Qualifications:</h4>
                            <div className="flex flex-wrap gap-1">
                              {doctor.qualifications.map((qual: string, index: number) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {qual}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {doctor.languages && doctor.languages.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-1">Languages:</h4>
                            <div className="flex flex-wrap gap-1">
                              {doctor.languages.map((lang: string, index: number) => (
                                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-muted-foreground gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Available: {doctor.availability}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link href={`/appointments?doctor=${doctor.userId}`} className="flex-1">
                        <Button className="w-full btn-primary">Book Appointment</Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="border-primary"
                        onClick={() => handleStartChat(doctor.id)}
                        disabled={!currentUser || isCreatingRoom === doctor.id}
                      >
                        {isCreatingRoom === doctor.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12">Why Patients Trust Our Doctors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[hsl(var(--suubi-green-50))] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top Credentials</h3>
              <p className="text-muted-foreground">Our doctors come from leading medical institutions with extensive training.</p>
            </div>

            <div className="text-center">
              <div className="bg-[hsl(var(--suubi-green-50))] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Patient Satisfaction</h3>
              <p className="text-muted-foreground">95% of our patients rate their experience as excellent or very good.</p>
            </div>

            <div className="text-center">
              <div className="bg-[hsl(var(--suubi-green-50))] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Always Accessible</h3>
              <p className="text-muted-foreground">Our doctors provide prompt responses and follow-ups for continuity of care.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}