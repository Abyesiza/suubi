'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  Mail,
  Calendar,
  Search,
  Award,
  ThumbsUp,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle,
  Users,
  Stethoscope,
  Languages,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

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

export default function StaffPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const router = useRouter();
  const { user: clerkUser } = useUser();

  // Fetch staff from profiles
  const doctorsRaw = useQuery(
    api.staffProfiles.listStaffWithUsers,
    selectedRole === 'all' ? {} : { role: selectedRole as any }
  );

  // Get current user from Convex
  const currentUser = useQuery(
    api.users.getCurrentUser,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  // Mutations
  const createRoomWithStaffProfile = useMutation(api.room.createOrGetRoomWithStaffProfile);

  const isLoading = doctorsRaw === undefined;
  const doctorsData = doctorsRaw ?? [];

  const staff = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return doctorsData
      .filter((item: any) => item && item.user && item.staffProfile)
      .map((item: any) => {
        const { user, staffProfile } = item;
        const firstName = user?.firstName ?? '';
        const lastName = user?.lastName ?? '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Staff Member';
        const image = staffProfile?.profileImage || user?.imageUrl;
        const specialty = staffProfile?.specialty || staffProfile?.subRole || 'General Practice';
        const experience = staffProfile?.experience || 0;
        const rating = staffProfile?.rating || 0;
        const bio = staffProfile?.bio || 'Experienced healthcare professional dedicated to providing quality care.';
        const isAvailable = staffProfile?.isAvailable ?? false;

        return {
          id: String(staffProfile._id),
          userId: String(user._id),
          name: fullName,
          initials: `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase(),
          image,
          specialty: specialty.replace(/_/g, ' '),
          experience,
          rating,
          bio,
          isAvailable,
          consultationFee: staffProfile?.consultationFee,
          qualifications: staffProfile?.qualifications || [],
          languages: staffProfile?.languages || [],
          role: staffProfile?.role,
          verified: staffProfile?.verified,
        };
      })
      .filter((staff) => {
        if (!normalizedQuery) return true;
        const name = staff.name.toLowerCase();
        const specialty = (staff.specialty || '').toLowerCase();
        const quals = (staff.qualifications || []).join(' ').toLowerCase();
        const langs = (staff.languages || []).join(' ').toLowerCase();
        return (
          name.includes(normalizedQuery) ||
          specialty.includes(normalizedQuery) ||
          quals.includes(normalizedQuery) ||
          langs.includes(normalizedQuery)
        );
      });
  }, [doctorsData, searchQuery]);

  // Handle chat button click
  const handleStartChat = async (staffProfileId: string) => {
    if (!currentUser) return;

    setIsCreatingRoom(staffProfileId);
    try {
      await createRoomWithStaffProfile({
        patientUserId: currentUser._id,
        staffProfileId: staffProfileId as Id<"staff_profiles">,
      });
      router.push(`/chat?staffProfileId=${staffProfileId}`);
    } catch (error) {
      console.error("Failed to create chat room:", error);
    } finally {
      setIsCreatingRoom(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-brand-navy">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        <div className="absolute right-10 bottom-10 opacity-5 pointer-events-none animate-pulse-slow">
          <Stethoscope className="w-64 h-64 text-white" />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white mb-6 backdrop-blur-sm">
              <Stethoscope className="w-3.5 h-3.5 text-brand-teal" />
              Expert Healthcare Team
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white font-heading leading-tight">
              Meet Our Medical Professionals
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our team of experienced healthcare professionals is dedicated to providing you with the highest quality care.
              Book an appointment or start a conversation today.
            </p>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto bg-white/5 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white border-0 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-brand-teal"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full sm:w-[200px] h-12 bg-white border-0 text-gray-900 focus:ring-2 focus:ring-brand-teal">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="nurse">Nurses</SelectItem>
                  <SelectItem value="allied_health">Allied Health</SelectItem>
                  <SelectItem value="support_staff">Support Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="pb-20">
        <div className="container-custom">
          {isLoading ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Card className="h-[400px] animate-pulse">
                    <div className="h-32 bg-muted rounded-t-lg" />
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : staff.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Users className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No staff found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {staff.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                    {/* Card Header */}
                    <div className="relative h-28 bg-gradient-to-br from-brand-teal to-brand-eucalyptus">
                      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
                      {/* Availability Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={member.isAvailable ? "default" : "secondary"}
                          className={member.isAvailable
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                          }
                        >
                          <span className={`w-2 h-2 rounded-full mr-1.5 ${member.isAvailable ? 'bg-green-200' : 'bg-gray-300'}`} />
                          {member.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="relative -mt-12 px-6">
                      <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="bg-brand-teal text-white text-xl font-semibold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      {member.verified && (
                        <div className="absolute bottom-0 right-6">
                          <div className="bg-brand-teal text-white rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6 pt-3 flex-1 flex flex-col">
                      {/* Name & Specialty */}
                      <div className="mb-3">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-brand-teal transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-brand-teal font-medium capitalize">{member.specialty}</p>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium">{member.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{member.experience} yrs exp</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                        {member.bio}
                      </p>

                      {/* Qualifications */}
                      {member.qualifications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {member.qualifications.slice(0, 3).map((qual: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                          {member.qualifications.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.qualifications.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Consultation Fee */}
                      {member.consultationFee && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <span className="text-xs text-muted-foreground">Consultation Fee</span>
                          <p className="font-semibold text-brand-teal">
                            UGX {member.consultationFee.toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto pt-4 border-t">
                        <Button asChild className="flex-1 bg-brand-teal hover:bg-brand-teal/90">
                          <Link href={`/booking?staffProfileId=${member.id}`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            Book
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleStartChat(member.id)}
                          disabled={!currentUser || isCreatingRoom === member.id}
                          className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                        >
                          {isCreatingRoom === member.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Patients Trust Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are committed to excellence in healthcare delivery and patient satisfaction.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-brand-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top Credentials</h3>
              <p className="text-muted-foreground text-sm">
                Our doctors come from leading medical institutions with extensive training and certifications.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-eucalyptus/10 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-brand-eucalyptus" />
              </div>
              <h3 className="text-lg font-semibold mb-2">95% Patient Satisfaction</h3>
              <p className="text-muted-foreground text-sm">
                The majority of our patients rate their experience as excellent or very good.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-amber/10 flex items-center justify-center">
                <Phone className="h-8 w-8 text-brand-amber" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Always Accessible</h3>
              <p className="text-muted-foreground text-sm">
                Our team provides prompt responses and follow-ups for continuity of care.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy to-brand-teal p-8 md:p-12 text-white"
          >
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Ready to Book an Appointment?
                </h2>
                <p className="text-white/80">
                  Schedule a consultation with one of our healthcare professionals today.
                </p>
              </div>
              <Button asChild size="lg" className="bg-white text-brand-navy hover:bg-white/90 shrink-0">
                <Link href="/booking">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
