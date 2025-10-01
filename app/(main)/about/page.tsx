'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Lifeline from '@/components/ui/Lifeline';
import { ArrowRight, Heart, Users, GraduationCap, Baby, PersonStanding, Brain, BookOpen, Leaf, Stethoscope, School } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Operational categories
const operationalCategories = [
  {
    title: "Gender Equality",
    description: "Promoting equal access to healthcare, education, and economic opportunities regardless of gender.",
    icon: <Users className="h-8 w-8 text-mustard" />,
  },
  {
    title: "Health Promotion",
    description: "Supporting initiatives that enhance community health awareness, prevention, and access to quality healthcare.",
    icon: <Stethoscope className="h-8 w-8 text-mustard" />,
  },
  {
    title: "Women Empowerment",
    description: "Creating opportunities for women to gain financial independence, leadership roles, and self-advocacy.",
    icon: <PersonStanding className="h-8 w-8 text-mustard" />,
  },
];

// Core Program Areas
const corePrograms = [
  {
    title: "Maternal & Child Health",
    description: "Providing specialized care for mothers and children through prenatal services, safe deliveries, and pediatric care.",
    icon: <Baby className="h-6 w-6 text-mustard" />,
  },
  {
    title: "Sexual Reproductive Health",
    description: "Offering education, screening, and treatment for reproductive health issues for both men and women.",
    icon: <Heart className="h-6 w-6 text-mustard" />,
  },
  {
    title: "Financial Literacy",
    description: "Training in savings, investment, and sustainable financial management practices.",
    icon: <School className="h-6 w-6 text-mustard" />,
  },
  {
    title: "HIV/AIDS Awareness",
    description: "Educational campaigns, testing services, and support for those affected by HIV/AIDS.",
    icon: <BookOpen className="h-6 w-6 text-mustard" />,
  },
  {
    title: "Mental Health Support",
    description: "Counseling services, therapy, and community education on mental health issues.",
    icon: <Brain className="h-6 w-6 text-mustard" />,
  },
  {
    title: "Education Sponsorship",
    description: "Providing opportunities for disadvantaged youth to access quality education.",
    icon: <GraduationCap className="h-6 w-6 text-mustard" />,
  },
  {
    title: "Environmentally Sustainable Projects",
    description: "Initiatives that promote environmental preservation alongside community development.",
    icon: <Leaf className="h-6 w-6 text-mustard" />,
  },
];

export default function AboutPage() {
  // Fetch verified staff members with their profile images
  const staffMembers = useQuery(api.staffProfiles.listStaffWithUsers, {});
  
  // Filter for verified staff and limit to 4 for the hero section
  const verifiedStaff = staffMembers?.filter(staff => staff.staffProfile.verified) || [];
  const heroStaff = verifiedStaff.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F5F7F9] to-white pt-32 pb-12 md:pb-16">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#2E8B57]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#F7941D]/5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 variants={fadeIn} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-dark-purple">
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2E8B57] to-[#1E6F47]">
                Suubi Healthcare
              </span>
            </motion.h1>

            <motion.div variants={fadeIn} className="w-32 h-1 bg-gradient-to-r from-[#F7941D] to-[#E1AD01] mx-auto mb-8 rounded-full"></motion.div>

            <motion.p variants={fadeIn} className="text-lg sm:text-xl lg:text-2xl text-dark-purple/80 mb-8 leading-relaxed max-w-3xl mx-auto">
              Suubi Healthcare is an initiative of the Boost Health Initiative (BHI), a non-profit organization dedicated to improving healthcare access and outcomes for marginalized communities in Uganda, with a special focus on women and children.
            </motion.p>

            <motion.p variants={fadeIn} className="text-base sm:text-lg text-dark-purple/70 mb-10 leading-relaxed max-w-3xl mx-auto">
              By combining medical expertise, community engagement, and sustainable development practices, we strive to create lasting positive change in the health landscape of underserved populations.
            </motion.p>

            {/* Healthcare Team Preview */}
            <motion.div variants={fadeIn} className="mb-10">
              <h3 className="text-xl font-semibold text-dark-purple mb-6">Meet Our Healthcare Team</h3>
              {heroStaff.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {heroStaff.map((staff, index) => {
                    // Get gradient colors based on role
                    const getGradientColor = (role: string) => {
                      switch (role) {
                        case 'doctor': return 'from-[#2E8B57]/20 to-[#2E8B57]/5';
                        case 'nurse': return 'from-[#F7941D]/20 to-[#F7941D]/5';
                        case 'allied_health': return 'from-[#1E3A5F]/20 to-[#1E3A5F]/5';
                        default: return 'from-[#2E8B57]/20 to-[#2E8B57]/5';
                      }
                    };

                    // Get role display name
                    const getRoleDisplayName = (role: string, subRole?: string) => {
                      switch (role) {
                        case 'doctor': return subRole || 'Doctor';
                        case 'nurse': return subRole || 'Nurse';
                        case 'allied_health': return subRole || 'Specialist';
                        default: return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
                      }
                    };

                    const profileImage = staff.staffProfile.profileImage || staff.user.imageUrl || '/img/placeholder-doctor.png';
                    const fullName = `${staff.user.firstName || ''} ${staff.user.lastName || ''}`.trim() || 'Team Member';
                    
                    return (
                      <motion.div
                        key={staff.staffProfile._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                        className="relative group"
                      >
                        <div className={`absolute -inset-1 bg-gradient-to-br ${getGradientColor(staff.staffProfile.role)} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}></div>
                        <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={profileImage}
                            alt={fullName}
                            width={120}
                            height={150}
                            className="w-full h-[120px] object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.src = '/img/placeholder-doctor.png';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2">
                            <span className="text-white font-semibold text-xs">
                              {getRoleDisplayName(staff.staffProfile.role, staff.staffProfile.subRole)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Fallback to static images if no staff data is available
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {/* Doctor */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#2E8B57]/20 to-[#2E8B57]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr2.png"
                        alt="Doctor"
                        width={120}
                        height={150}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2">
                        <span className="text-white font-semibold text-xs">Doctor</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Specialist */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#F7941D]/20 to-[#F7941D]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr3.png"
                        alt="Specialist"
                        width={120}
                        height={150}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2">
                        <span className="text-white font-semibold text-xs">Specialist</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Nurse 1 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#2E8B57]/20 to-[#2E8B57]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr5.png"
                        alt="Nurse"
                        width={120}
                        height={150}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2">
                        <span className="text-white font-semibold text-xs">Nurse</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Nurse 2 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#1E3A5F]/20 to-[#1E3A5F]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr6.png"
                        alt="Nurse"
                        width={120}
                        height={150}
                        className="w-full h-[120px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-2">
                        <span className="text-white font-semibold text-xs">Nurse</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              <p className="text-sm text-dark-purple/70 mt-4 font-medium">
                Our dedicated healthcare professionals serving communities across Uganda
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-[#F7941D] to-[#FF8C00] text-white hover:from-[#FF8C00] hover:to-[#F7941D] transition-all px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 duration-200 hover:-translate-y-1 group">
                <Link href="/donate">
                  Support Our Mission <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-dark-purple/20 text-dark-purple hover:border-dark-purple hover:bg-dark-purple/5 transition-all px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission and Vision */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8 lg:mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Our Vision & Mission</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-4 md:mb-6 rounded-full"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#73A580]/5 p-6 md:p-8 rounded-lg border border-[#73A580]/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
                <Lifeline color="#E1AD01" height="4px" variant="thin" className="opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 md:mb-4 text-dark-purple">Our Vision</h3>
              <p className="text-dark-purple/80 mb-4 md:mb-6">
                To create communities where every individual, regardless of their socioeconomic status, has access to quality healthcare, equal opportunities, and the resources they need to lead a healthy and dignified life.
              </p>
              <p className="text-dark-purple/80">
                We envision a Uganda where healthcare disparities are eliminated, and marginalized populations are empowered to take control of their well-being.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#73A580]/5 p-6 md:p-8 rounded-lg border border-[#73A580]/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
                <Lifeline color="#E1AD01" height="4px" variant="thin" className="opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 md:mb-4 text-dark-purple">Our Mission</h3>
              <p className="text-dark-purple/80 mb-4 md:mb-6">
                To implement sustainable health initiatives, educational programs, and economic empowerment projects that address the unique challenges faced by marginalized communities, with a special focus on women and children in Uganda.
              </p>
              <p className="text-dark-purple/80">
                Through collaboration with local stakeholders, healthcare professionals, and international partners, we aim to create lasting solutions that improve health outcomes and quality of life.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-8 md:py-12 lg:py-16 bg-[#F5F7F9]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8 lg:mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Our Story</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-4 md:mb-6 rounded-full"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 order-2 md:order-1"
            >
              <div className="space-y-4 md:space-y-6 text-dark-purple/80">
                <p>
                  Boost Health Initiative (BHI) was founded in 2015 by a team of Ugandan healthcare professionals and community leaders who witnessed firsthand the devastating impact of healthcare inequality in rural and urban underserved areas.
                </p>
                <p>
                  What began as a small mobile clinic serving a handful of villages has grown into a comprehensive healthcare initiative that now reaches thousands of Ugandans through various programs and services, including our flagship Suubi Healthcare platform.
                </p>
                <p>
                  The name "Suubi" means "hope" in Luganda, reflecting our commitment to bringing hope through healthcare to communities that have historically been overlooked by traditional medical systems.
                </p>
                <p>
                  Today, BHI operates in several districts across Uganda, partnering with local government, international NGOs, and private sector entities to maximize our impact and ensure the sustainability of our initiatives.
                </p>
                <p>
                  Our multidisciplinary team includes doctors, nurses, public health specialists, educators, and community mobilizers who work together to address not just medical needs but also the social determinants of health that affect overall wellbeing.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-5 order-1 md:order-2"
            >
              {/* Healthcare Team Collage */}
              {verifiedStaff.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {verifiedStaff.slice(0, 4).map((staff, index) => {
                    // Get gradient colors based on role
                    const getGradientColor = (role: string) => {
                      switch (role) {
                        case 'doctor': return 'from-[#2E8B57]/20 to-[#2E8B57]/5';
                        case 'nurse': return 'from-[#F7941D]/20 to-[#F7941D]/5';
                        case 'allied_health': return 'from-[#1E3A5F]/20 to-[#1E3A5F]/5';
                        default: return 'from-[#2E8B57]/20 to-[#2E8B57]/5';
                      }
                    };

                    // Get role display name
                    const getRoleDisplayName = (role: string, subRole?: string) => {
                      switch (role) {
                        case 'doctor': return subRole || 'Doctor';
                        case 'nurse': return subRole || 'Nurse';
                        case 'allied_health': return subRole || 'Specialist';
                        default: return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
                      }
                    };

                    const profileImage = staff.staffProfile.profileImage || staff.user.imageUrl || '/img/placeholder-doctor.png';
                    const fullName = `${staff.user.firstName || ''} ${staff.user.lastName || ''}`.trim() || 'Team Member';
                    const isTopRow = index < 2;
                    const isLeftColumn = index % 2 === 0;
                    
                    return (
                      <motion.div
                        key={staff.staffProfile._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                        className={`relative group ${isTopRow && !isLeftColumn ? 'mt-4' : ''} ${!isTopRow && isLeftColumn ? '-mt-4' : ''}`}
                      >
                        <div className={`absolute -inset-1 bg-gradient-to-br ${getGradientColor(staff.staffProfile.role)} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}></div>
                        <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={profileImage}
                            alt={fullName}
                            width={200}
                            height={250}
                            className="w-full h-[180px] object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.src = '/img/placeholder-doctor.png';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                            <span className="text-white font-semibold text-sm">
                              {getRoleDisplayName(staff.staffProfile.role, staff.staffProfile.subRole)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // Fallback to static images if no staff data is available
                <div className="grid grid-cols-2 gap-4">
                  {/* Doctor - Top Left */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#2E8B57]/20 to-[#2E8B57]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr2.png"
                        alt="Doctor"
                        width={200}
                        height={250}
                        className="w-full h-[180px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                        <span className="text-white font-semibold text-sm">Doctor</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Specialist - Top Right */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="relative group mt-4"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#F7941D]/20 to-[#F7941D]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr3.png"
                        alt="Specialist"
                        width={200}
                        height={250}
                        className="w-full h-[180px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                        <span className="text-white font-semibold text-sm">Specialist</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Nurse 1 - Bottom Left */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="relative group -mt-4"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#2E8B57]/20 to-[#2E8B57]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr5.png"
                        alt="Nurse"
                        width={200}
                        height={250}
                        className="w-full h-[180px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                        <span className="text-white font-semibold text-sm">Nurse</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Nurse 2 - Bottom Right */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#1E3A5F]/20 to-[#1E3A5F]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                    <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/img/dr6.png"
                        alt="Nurse"
                        width={200}
                        height={250}
                        className="w-full h-[180px] object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                        <span className="text-white font-semibold text-sm">Nurse</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              
              {/* Team caption */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-6 text-center"
              >
                <p className="text-dark-purple/70 text-sm font-medium">
                  Our dedicated healthcare team serving communities across Uganda
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Operational Categories */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8 lg:mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Operational Categories</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-dark-purple/80 max-w-3xl mx-auto">
              BHI's work is organized into three core operational categories that guide our approach to addressing community needs:
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {operationalCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 md:p-8 h-full border-[#73A580]/30 flex flex-col">
                  <div className="bg-[#73A580]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-3 md:mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 md:mb-3 text-dark-purple">{category.title}</h3>
                  <p className="text-dark-purple/80">{category.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Core Program Areas */}
      <section className="py-8 md:py-12 lg:py-16 bg-[#F5F7F9]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 md:mb-8 lg:mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Core Program Areas</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-dark-purple/80 max-w-3xl mx-auto">
              Our initiatives span across seven key program areas, allowing us to address the diverse needs of the communities we serve:
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {corePrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-[#73A580]/20"
              >
                <div className="flex gap-3 md:gap-4">
                  <div className="bg-[#73A580]/10 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-dark-purple">{program.title}</h3>
                    <p className="text-dark-purple/70 text-sm">{program.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-8 md:py-12 lg:py-16 bg-dark-purple text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4 md:mb-6">Join Us in Making a Difference</h2>
            <p className="mb-6 md:mb-8 text-white/80">
              Your support enables us to continue our vital work in communities across Uganda. Whether through donations, 
              volunteering, or spreading awareness, every contribution makes a meaningful impact in the lives of those 
              who need it most.
            </p>
            <Button asChild className="bg-mustard hover:bg-white text-dark-purple hover:text-dark-purple group mx-auto">
              <Link href="/donate">
                Make a Donation <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 