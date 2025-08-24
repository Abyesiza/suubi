'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Mail, Calendar, Phone, Award, ThumbsUp } from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function DoctorsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch all staff users (non-admin) directly from users table
  const staffUsersRaw = useQuery(api.users.listStaffUsers, {} as any);
  const isLoading = staffUsersRaw === undefined;
  const staffUsers = staffUsersRaw ?? [];

  const doctors = useMemo(() => {
    return staffUsers.map((user) => {
      const firstName = user?.firstName ?? '';
      const lastName = user?.lastName ?? '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Staff';
      const image = user?.imageUrl || 'https://via.placeholder.com/600x400?text=Staff';
      const roleLabel = String(user.role || '').replace(/_/g, ' ');
      const subRoleLabel = user?.subRole ? String(user.subRole).replace(/_/g, ' ') : '';
      return {
        id: String(user._id),
        name: fullName,
        image,
        specialty: subRoleLabel || roleLabel || 'General',
        experience: '—',
        rating: 0,
        bio: '—',
        availability: '—',
      };
    });
  }, [staffUsers]);

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
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>

                    <p className="text-primary font-medium mb-2">{doctor.specialty}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{doctor.experience} experience</span>
                    </div>

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

                    <div className="flex items-center text-sm text-muted-foreground gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Available: {doctor.availability}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link href={`/appointments?doctor=${doctor.id}`} className="flex-1">
                        <Button className="w-full btn-primary">Book Appointment</Button>
                      </Link>
                      <Link href={`/chat?doctor=${doctor.id}`}>
                        <Button variant="outline" className="border-primary">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </Link>
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