'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowRight,
  Heart,
  Users,
  GraduationCap,
  Baby,
  PersonStanding,
  Brain,
  BookOpen,
  Leaf,
  Stethoscope,
  School,
  Target,
  Eye,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Operational categories
const operationalCategories = [
  {
    title: "Gender Equality",
    description: "Promoting equal access to healthcare, education, and economic opportunities regardless of gender.",
    icon: Users,
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    title: "Health Promotion",
    description: "Supporting initiatives that enhance community health awareness, prevention, and access to quality healthcare.",
    icon: Stethoscope,
    color: "bg-brand-eucalyptus/10 text-brand-eucalyptus",
  },
  {
    title: "Women Empowerment",
    description: "Creating opportunities for women to gain financial independence, leadership roles, and self-advocacy.",
    icon: PersonStanding,
    color: "bg-brand-amber/10 text-brand-amber",
  },
];

// Core Program Areas
const corePrograms = [
  {
    title: "Maternal & Child Health",
    description: "Providing specialized care for mothers and children through prenatal services, safe deliveries, and pediatric care.",
    icon: Baby,
  },
  {
    title: "Sexual Reproductive Health",
    description: "Offering education, screening, and treatment for reproductive health issues for both men and women.",
    icon: Heart,
  },
  {
    title: "Financial Literacy",
    description: "Training in savings, investment, and sustainable financial management practices.",
    icon: School,
  },
  {
    title: "HIV/AIDS Awareness",
    description: "Educational campaigns, testing services, and support for those affected by HIV/AIDS.",
    icon: BookOpen,
  },
  {
    title: "Mental Health Support",
    description: "Counseling services, therapy, and community education on mental health issues.",
    icon: Brain,
  },
  {
    title: "Education Sponsorship",
    description: "Providing opportunities for disadvantaged youth to access quality education.",
    icon: GraduationCap,
  },
  {
    title: "Environmental Projects",
    description: "Initiatives that promote environmental preservation alongside community development.",
    icon: Leaf,
  },
];

export default function AboutPage() {
  const staffMembers = useQuery(api.staffProfiles.listStaffWithUsers, {});
  const verifiedStaff = staffMembers?.filter(staff => staff.staffProfile.verified) || [];
  const heroStaff = verifiedStaff.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-eucalyptus/5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20">
                <Sparkles className="w-3 h-3 mr-1" />
                About Us
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              About{' '}
              <span className="bg-gradient-to-r from-brand-teal to-brand-eucalyptus bg-clip-text text-transparent">
                Suubi Healthcare
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto"
            >
              Suubi Healthcare is an initiative of the Boost Health Initiative (BHI), a non-profit organization dedicated to improving healthcare access and outcomes for marginalized communities in Uganda, with a special focus on women and children.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-base text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
            >
              By combining medical expertise, community engagement, and sustainable development practices, we strive to create lasting positive change in the health landscape of underserved populations.
            </motion.p>

            {/* Healthcare Team Preview */}
            <motion.div variants={itemVariants} className="mb-10">
              <h3 className="text-xl font-semibold mb-6">Meet Our Healthcare Team</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {heroStaff.length > 0 ? (
                  heroStaff.map((staff, index) => (
                    <motion.div
                      key={staff.staffProfile._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="relative group"
                    >
                      <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                        <AvatarImage
                          src={staff.staffProfile.profileImage || staff.user.imageUrl}
                          alt={`${staff.user.firstName} ${staff.user.lastName}`}
                        />
                        <AvatarFallback className="bg-brand-teal text-white">
                          {staff.user.firstName?.[0]}{staff.user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <Badge variant="secondary" className="text-[10px] px-2 py-0">
                          {staff.staffProfile.role === 'doctor' ? 'Dr.' : staff.staffProfile.role}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 w-20 rounded-full bg-muted animate-pulse" />
                  ))
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Our dedicated healthcare professionals serving communities across Uganda
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90">
                <Link href="/donate">
                  Support Our Mission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-eucalyptus/10 text-brand-eucalyptus">Our Purpose</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vision & Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Guided by our commitment to healthcare equity and community empowerment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden border-brand-teal/20 hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-brand-teal to-brand-eucalyptus" />
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-brand-teal/10">
                      <Eye className="h-6 w-6 text-brand-teal" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    To create communities where every individual, regardless of their socioeconomic status, has access to quality healthcare, equal opportunities, and the resources they need to lead a healthy and dignified life.
                  </p>
                  <p className="text-muted-foreground">
                    We envision a Uganda where healthcare disparities are eliminated, and marginalized populations are empowered to take control of their well-being.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full overflow-hidden border-brand-eucalyptus/20 hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-brand-eucalyptus to-brand-teal" />
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-brand-eucalyptus/10">
                      <Target className="h-6 w-6 text-brand-eucalyptus" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    To implement sustainable health initiatives, educational programs, and economic empowerment projects that address the unique challenges faced by marginalized communities, with a special focus on women and children in Uganda.
                  </p>
                  <p className="text-muted-foreground">
                    Through collaboration with local stakeholders, healthcare professionals, and international partners, we aim to create lasting solutions that improve health outcomes and quality of life.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-7 order-2 md:order-1"
            >
              <Badge className="mb-4 bg-brand-amber/10 text-brand-amber">Our Journey</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>

              <div className="space-y-4 text-muted-foreground">
                <p>
                  Boost Health Initiative (BHI) was founded in 2015 by a team of Ugandan healthcare professionals and community leaders who witnessed firsthand the devastating impact of healthcare inequality in rural and urban underserved areas.
                </p>
                <p>
                  What began as a small mobile clinic serving a handful of villages has grown into a comprehensive healthcare initiative that now reaches thousands of Ugandans through various programs and services, including our flagship Suubi Healthcare platform.
                </p>
                <p>
                  The name <strong className="text-foreground">"Suubi"</strong> means <strong className="text-brand-teal">"hope"</strong> in Luganda, reflecting our commitment to bringing hope through healthcare to communities that have historically been overlooked by traditional medical systems.
                </p>
                <p>
                  Today, BHI operates in several districts across Uganda, partnering with local government, international NGOs, and private sector entities to maximize our impact and ensure the sustainability of our initiatives.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-5 order-1 md:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                {verifiedStaff.slice(0, 4).map((staff, index) => (
                  <motion.div
                    key={staff.staffProfile._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ y: -5 }}
                    className={`relative group ${index % 2 === 1 ? 'mt-4' : ''}`}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={staff.staffProfile.profileImage || staff.user.imageUrl || '/img/placeholder-doctor.png'}
                          alt={`${staff.user.firstName} ${staff.user.lastName}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <Badge className="bg-white/90 text-foreground text-xs">
                            {staff.staffProfile.role === 'doctor' ? 'Doctor' : staff.staffProfile.role}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                {verifiedStaff.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`h-40 rounded-lg bg-muted animate-pulse ${i % 2 === 1 ? 'mt-4' : ''}`} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Operational Categories */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-teal/10 text-brand-teal">What We Do</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Operational Categories</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              BHI's work is organized into three core operational categories that guide our approach to addressing community needs
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {operationalCategories.map((category, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-4`}>
                      <category.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Program Areas */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-eucalyptus/10 text-brand-eucalyptus">Programs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Program Areas</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our initiatives span across seven key program areas, allowing us to address the diverse needs of the communities we serve
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {corePrograms.map((program, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -3 }}>
                <Card className="h-full hover:shadow-md transition-all duration-300 bg-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-brand-teal/10 shrink-0">
                        <program.icon className="h-5 w-5 text-brand-teal" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{program.title}</h3>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy to-brand-teal p-8 md:p-12 text-white"
          >
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us in Making a Difference</h2>
              <p className="text-white/80 mb-8 text-lg">
                Your support enables us to continue our vital work in communities across Uganda. Whether through donations,
                volunteering, or spreading awareness, every contribution makes a meaningful impact in the lives of those
                who need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-brand-navy hover:bg-white/90">
                  <Link href="/donate">
                    Make a Donation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/staff">Meet Our Team</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
