'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import Lifeline from '@/components/ui/Lifeline';
import { Heart, User, Phone, Mail, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Patient registration data:', values);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Patient Registration Submitted",
        description: "Thank you for registering a patient in need. Our team will review the information and reach out shortly.",
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#73A580]/20 to-white pt-24 pb-16">
        <div className="absolute top-0 left-0 right-0 h-8">
          <Lifeline color="#E1AD01" height="12px" variant="thin" className="opacity-30" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 variants={fadeIn} className="text-4xl font-bold mb-4 text-dark-purple">Register a Patient in Need</motion.h1>
            <motion.div variants={fadeIn} className="w-32 h-6 mx-auto mb-6">
              <Lifeline color="#E1AD01" height="12px" variant="minimal" />
            </motion.div>
            <motion.p variants={fadeIn} className="text-dark-purple/80 mb-8 text-lg">
              Know someone who needs medical assistance but can't afford it? Register them here, and our team will 
              review their case for potential support through our healthcare assistance program.
            </motion.p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-8">
          <Lifeline color="#E1AD01" height="12px" variant="thin" className="opacity-30 transform rotate-180" />
        </div>
      </section>
      
      {/* Registration Form */}
      <section className="py-16">
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
                className="bg-white p-8 rounded-xl shadow-md text-center"
              >
                <div className="mx-auto w-16 h-16 bg-suubi-green/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-10 w-10 text-suubi-green" />
                </div>
                <h2 className="text-2xl font-bold text-dark-purple mb-4">Registration Submitted Successfully!</h2>
                <p className="text-dark-purple/80 mb-6">
                  Thank you for registering a patient in need. Our team will review the information and contact you within 2-3 business days.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/donate">
                    <Button className="bg-mustard hover:bg-mustard/80 text-dark-purple">
                      Donate to Support Patients
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white">
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
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-purple">How It Works</h2>
            <div className="w-32 h-6 mx-auto mb-4">
              <Lifeline color="#E1AD01" height="12px" variant="minimal" />
            </div>
            <p className="text-dark-purple/80 max-w-3xl mx-auto">
              Our patient support program helps connect those in need with medical resources and financial assistance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-[#73A580]/30">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-mustard/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-mustard" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-dark-purple">1. Register</h3>
                <p className="text-dark-purple/70">
                  Submit the patient's information and medical needs through our secure form.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-[#73A580]/30">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-mustard/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-mustard" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-dark-purple">2. Assessment</h3>
                <p className="text-dark-purple/70">
                  Our medical team reviews the case to determine eligibility and required assistance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-[#73A580]/30">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-mustard/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-mustard" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-dark-purple">3. Support</h3>
                <p className="text-dark-purple/70">
                  Eligible patients receive medical care, medication, or financial assistance based on their needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16">
        <div className="container-custom">
          <Card className="border-0 bg-mustard/10 overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="absolute top-0 left-0 right-0 h-8">
                <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-30" />
              </div>
              
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-dark-purple">Want to Help More?</h2>
                <p className="text-dark-purple/80 mb-8">
                  Your donations help us provide medical care to patients who cannot afford it. Consider supporting our mission to make healthcare accessible to all.
                </p>
                <Link href="/donate">
                  <Button size="lg" className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors">
                    Donate Now
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-8">
                <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-30 transform rotate-180" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 