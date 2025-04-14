'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search, Mail, Calendar, Phone, Award, ThumbsUp } from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';
import Link from 'next/link';

// Sample doctors data
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500',
    specialty: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    reviews: 124,
    education: 'Harvard Medical School',
    availability: 'Mon, Wed, Fri',
    bio: "Dr. Johnson specializes in complex cardiovascular conditions and preventive cardiology with a patient-centered approach.",
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500',
    specialty: 'Pediatrician',
    experience: '12 years',
    rating: 4.9,
    reviews: 98,
    education: 'Johns Hopkins University',
    availability: 'Tue, Thu, Sat',
    bio: "Dr. Chen is passionate about children's health and development, with specialized training in childhood asthma and allergies.",
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=500',
    specialty: 'Neurologist',
    experience: '10 years',
    rating: 4.7,
    reviews: 86,
    education: 'Stanford University',
    availability: 'Mon, Tue, Thu',
    bio: "Dr. Rodriguez focuses on neurological disorders with expertise in headache management and stroke prevention.",
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    image: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=500',
    specialty: 'Dermatologist',
    experience: '8 years',
    rating: 4.6,
    reviews: 72,
    education: 'Yale School of Medicine',
    availability: 'Wed, Fri, Sat',
    bio: 'Dr. Wilson specializes in medical and cosmetic dermatology with an emphasis on skin cancer prevention and treatment.',
  },
  {
    id: 5,
    name: 'Dr. Olivia Taylor',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=500',
    specialty: 'Orthopedic Surgeon',
    experience: '14 years',
    rating: 4.9,
    reviews: 110,
    education: 'University of Pennsylvania',
    availability: 'Mon, Thu, Fri',
    bio: 'Dr. Taylor is an expert in joint replacement surgery and sports medicine with a focus on minimally invasive techniques.',
  },
  {
    id: 6,
    name: 'Dr. Robert Kim',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=500',
    specialty: 'Psychiatrist',
    experience: '11 years',
    rating: 4.8,
    reviews: 91,
    education: 'Columbia University',
    availability: 'Tue, Wed, Sat',
    bio: 'Dr. Kim provides compassionate mental health care with expertise in mood disorders and anxiety management.',
  },
];

// Specialties for filter
const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });
  
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
        
        {/* Search and Filter Section */}
        <div className="mb-10 bg-[hsl(var(--suubi-green-50))] p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialty..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-72">
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="all">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            
            {(searchQuery || selectedSpecialty !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('all');
                }}
                className="text-primary hover:text-primary/80"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2 text-foreground">No doctors found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Button 
              variant="outline" 
              className="border-primary text-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
              }}
            >
              View All Doctors
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden border-green-light h-full flex flex-col">
                  {/* Doctor Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-12">
                      <Lifeline 
                        color="#FF9933" 
                        height="20px" 
                        variant="thin"
                        className="opacity-60"
                      />
                    </div>
                  </div>
                  
                  {/* Doctor Info */}
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
                      {expandedId === doctor.id 
                        ? doctor.bio 
                        : `${doctor.bio.substring(0, 80)}...`}
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
        
        {/* Trust Indicators Section */}
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