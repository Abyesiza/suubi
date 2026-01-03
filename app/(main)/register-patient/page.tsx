'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, User, Phone, Mail, FileText, ChevronRight, CheckCircle, Users, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

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
      staggerChildren: 0.1,
    },
  },
};

// Form validation schema
const formSchema = z.object({
  patientName: z.string().min(2, {
    message: 'Patient name must be at least 2 characters.',
  }),
  patientAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 120, {
    message: 'Please enter a valid age.',
  }),
  patientGender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender.',
  }),
  condition: z.string().min(2, {
    message: 'Please describe the medical condition.',
  }),
  conditionDetails: z.string().min(10, {
    message: 'Please provide more details about the condition.',
  }),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'Please select an urgency level.',
  }),
  location: z.string().min(2, {
    message: 'Please provide the patient\'s location.',
  }),
  contactName: z.string().min(2, {
    message: 'Contact name must be at least 2 characters.',
  }),
  contactPhone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  contactEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  relationship: z.string().min(2, {
    message: 'Please specify your relationship to the patient.',
  }),
  consentToShare: z.boolean().refine(val => val === true, {
    message: 'You must give consent to share this information.',
  }),
});

export default function RegisterPatientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Convex mutation
  const createRegistration = useMutation(api.patientRegistrations.createRegistration);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      patientAge: '',
      patientGender: undefined,
      condition: '',
      conditionDetails: '',
      urgencyLevel: undefined,
      location: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      relationship: '',
      consentToShare: false,
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      await createRegistration({
        patientName: values.patientName,
        patientAge: parseInt(values.patientAge),
        patientGender: values.patientGender,
        location: values.location,
        condition: values.condition,
        conditionDetails: values.conditionDetails,
        urgencyLevel: values.urgencyLevel,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        relationship: values.relationship,
      });

      setIsSuccess(true);
      toast.success("Patient Registration Submitted", {
        description: "Thank you for registering a patient in need. Our team will review the information and reach out shortly.",
      });

      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      toast.error("Submission Failed", {
        description: "There was an error submitting the registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Brand Navy Hero Section */}
      <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              Register a Patient in Need
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-gray-300 max-w-2xl mx-auto">
              Know someone who needs medical assistance but can't afford it? Register them here,
              and our team will review their case for potential support.
            </motion.p>
          </motion.div>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
          <HeartHandshake className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
          <Users className="w-32 h-32 text-white" />
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 -mt-20 relative z-10">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {!isSuccess ? (
              <Card className="border-[#73A580]/30 shadow-md overflow-hidden">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-semibold mb-2 text-dark-purple flex items-center">
                      <User className="mr-2 h-6 w-6 text-mustard" />
                      Patient Information
                    </h2>
                    <p className="text-dark-purple/80">
                      Please provide accurate information about the patient who needs medical assistance.
                    </p>
                  </motion.div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Patient Information Section */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="patientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient's Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="patientAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient's Age</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter age" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="patientGender"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Male
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Female
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="other" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Other
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient's Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, District" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Medical Condition Section */}
                      <div className="pt-4 border-t border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-dark-purple flex items-center">
                          <Heart className="mr-2 h-6 w-6 text-mustard" />
                          Medical Condition
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Medical Condition</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g., Diabetes, Heart Disease" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="urgencyLevel"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Urgency Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select urgency level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">Low - Needs attention within months</SelectItem>
                                    <SelectItem value="medium">Medium - Needs attention within weeks</SelectItem>
                                    <SelectItem value="high">High - Needs attention within days</SelectItem>
                                    <SelectItem value="critical">Critical - Needs immediate attention</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="conditionDetails"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Condition Details</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please provide details about the medical condition, treatment history, and current needs..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="pt-4 border-t border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-dark-purple flex items-center">
                          <Phone className="mr-2 h-6 w-6 text-mustard" />
                          Contact Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="relationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship to Patient</FormLabel>
                                <FormControl>
                                  <Input placeholder="E.g., Family member, Friend" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter email address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Consent */}
                      <div className="pt-4 border-t border-gray-200">
                        <FormField
                          control={form.control}
                          name="consentToShare"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I consent to share this information with Suubi Healthcare and its medical team for the purpose of evaluating eligibility for assistance.
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-suubi-green hover:bg-suubi-green/90 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Register Patient'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl shadow-brand-lg text-center"
              >
                <div className="mx-auto w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-brand-teal" />
                </div>
                <h2 className="text-2xl font-bold text-brand-navy mb-4">Registration Submitted Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for registering a patient in need. Our team will review the information and contact you within 2-3 business days.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/donate">
                    <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">
                      Donate to Support Patients
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white">
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-heading text-brand-navy">How It Works</h2>
            <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our patient support program helps connect those in need with medical resources and financial assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-200 shadow-brand-soft hover:shadow-brand-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-7 w-7 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-navy">1. Register</h3>
                <p className="text-gray-600 leading-relaxed">
                  Submit the patient's information and medical needs through our secure form.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-brand-soft hover:shadow-brand-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-7 w-7 text-brand-teal" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-navy">2. Assessment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our medical team reviews the case to determine eligibility and required assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-brand-soft hover:shadow-brand-md transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="h-14 w-14 bg-brand-navy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-7 w-7 text-brand-navy" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-navy">3. Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Eligible patients receive medical care, medication, or financial assistance based on their needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden bg-brand-navy p-12 text-center">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 opacity-10">
              <HeartHandshake className="w-64 h-64 text-white" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading text-white">Want to Help More?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Your donations help us provide medical care to patients who cannot afford it. Consider supporting our mission to make healthcare accessible to all.
              </p>
              <Link href="/donate">
                <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none h-12 px-8 text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Donate Now
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}