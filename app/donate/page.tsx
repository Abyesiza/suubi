'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Lifeline from '@/components/ui/Lifeline';
import { ArrowRight, Pill, User, HeartPulse, Check, X, AlertCircle } from 'lucide-react';
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
      staggerChildren: 0.2,
    },
  },
};

// Featured patient stories
const patients = [
  {
    id: 1,
    name: 'Sarah Namuwange',
    condition: 'Diabetes',
    story: 'Sarah is a 42-year-old mother of four who has been struggling with diabetes for the past 5 years. Without regular medication, she faces severe health complications that affect her ability to work and care for her children.',
    needs: 'Monthly medication, glucose monitoring supplies, and nutritional support',
    amount: 350000, // Amount in UGX
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=600&h=800'
  },
  {
    id: 2,
    name: 'Joshua Mutumba',
    condition: 'Post-surgical care',
    story: 'Joshua, 12, recently underwent surgery to correct a congenital heart defect. His family cannot afford the follow-up care and medication needed for his recovery and long-term health.',
    needs: 'Follow-up medical visits, medication, and specialized nutrition',
    amount: 580000, // Amount in UGX
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&h=800'
  },
  {
    id: 3,
    name: 'Agnes Nabukenya',
    condition: 'Maternal Health',
    story: 'Agnes is expecting her first child and lives in a remote village without access to prenatal care. She needs regular check-ups to ensure a safe pregnancy and delivery.',
    needs: 'Prenatal vitamins, medical check-ups, and safe delivery services',
    amount: 420000, // Amount in UGX
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600&h=800'
  }
];

// Donation options
const donationOptions = [
  { value: '50000', label: '50,000 UGX' },
  { value: '100000', label: '100,000 UGX' },
  { value: '200000', label: '200,000 UGX' },
  { value: '500000', label: '500,000 UGX' },
  { value: 'custom', label: 'Custom Amount' }
];

// Impact metrics
const impactMetrics = [
  {
    title: 'Medication',
    description: '50,000 UGX provides a month of essential medication for a patient',
    icon: <Pill className="h-8 w-8 text-mustard" />
  },
  {
    title: 'Medical Care',
    description: '100,000 UGX covers a comprehensive medical check-up for a mother and child',
    icon: <HeartPulse className="h-8 w-8 text-mustard" />
  },
  {
    title: 'Continuous Support',
    description: '500,000 UGX supports a patient\'s complete treatment cycle',
    icon: <User className="h-8 w-8 text-mustard" />
  }
];

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  patientId: z.string().optional(),
  donationAmount: z.enum(['50000', '100000', '200000', '500000', 'custom']),
  customAmount: z.string().optional(),
  dedicateGift: z.boolean().default(false),
  honorName: z.string().optional(),
  message: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms to proceed.',
  }),
});

export default function DonatePage() {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      donationAmount: '100000',
      dedicateGift: false,
      agreeTerms: false,
    },
  });

  const dedicateGift = form.watch('dedicateGift');
  const donationAmount = form.watch('donationAmount');

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Donation data:', values);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Donation Submitted",
        description: "Thank you for your generous donation! Your support makes a difference.",
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        setSelectedPatient(null);
      }, 3000);
    }, 1500);
  }

  // Select a patient and update form
  const handlePatientSelect = (id: number) => {
    setSelectedPatient(id === selectedPatient ? null : id);
    
    if (id !== selectedPatient) {
      form.setValue('patientId', id.toString());
    } else {
      form.setValue('patientId', undefined);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F5F7F9] to-white pt-24 pb-16">
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
            <motion.h1 variants={fadeIn} className="text-4xl font-bold mb-4 text-dark-purple">Support Our Medical Mission</motion.h1>
            <motion.div variants={fadeIn} className="w-32 h-6 mx-auto mb-6">
              <Lifeline color="#E1AD01" height="12px" variant="minimal" />
            </motion.div>
            <motion.p variants={fadeIn} className="text-dark-purple/80 mb-8 text-lg">
              Your donation provides essential medical care to patients in underserved communities who would otherwise 
              go without treatment. Every contribution, no matter the size, makes a meaningful difference in someone's life.
            </motion.p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-8">
          <Lifeline color="#E1AD01" height="12px" variant="thin" className="opacity-30 transform rotate-180" />
        </div>
      </section>
      
      {/* Register a Patient Section */}
      <section className="py-10 bg-mustard/10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-dark-purple">Know Someone Who Needs Help?</h2>
                <div className="w-24 h-1 bg-mustard mb-6 rounded-full"></div>
                <p className="text-dark-purple/80 mb-6">
                  If you know someone who needs medical assistance but cannot afford it, you can register them for our patient support program. Our team will review their case and determine if they qualify for financial assistance or subsidized care.
                </p>
                <Link href="/register-patient">
                  <Button className="bg-suubi-green hover:bg-suubi-green/90 text-white">
                    Register a Patient in Need
                  </Button>
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl overflow-hidden shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/60 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1170" 
                  alt="Doctor helping a patient" 
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-white font-semibold text-lg">
                    "Every patient deserves quality healthcare, regardless of their financial situation."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Patients */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Featured Patient Stories</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-6 rounded-full"></div>
            <p className="text-dark-purple/80 max-w-3xl mx-auto">
              Meet some of the patients whose lives can be transformed through your generosity. Your donation 
              will directly help provide the care they desperately need.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card 
                  className={`h-full overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPatient === patient.id 
                      ? 'border-mustard shadow-lg scale-[1.02]' 
                      : 'border-[#73A580]/30 hover:border-[#73A580] hover:shadow'
                  }`}
                  onClick={() => handlePatientSelect(patient.id)}
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={patient.image}
                      alt={patient.name}
                      fill
                      className="object-cover"
                    />
                    {selectedPatient === patient.id && (
                      <div className="absolute top-2 right-2 bg-mustard rounded-full p-1">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1 text-dark-purple">{patient.name}</h3>
                    <p className="text-sm font-medium text-suubi-green mb-3">{patient.condition}</p>
                    <p className="text-dark-purple/80 mb-4 text-sm">{patient.story}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-dark-purple">Needs:</p>
                        <p className="text-sm text-dark-purple/80">{patient.needs}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-purple">Required Amount:</p>
                        <p className="text-mustard font-bold">{patient.amount.toLocaleString()} UGX</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Impact */}
      <section className="py-16 bg-[#F5F7F9]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">Your Impact</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-6 rounded-full"></div>
            <p className="text-dark-purple/80 max-w-3xl mx-auto">
              See how your donation directly helps patients in need. Every contribution creates a meaningful impact 
              in someone's healthcare journey.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full border-[#73A580]/30 flex flex-col items-center text-center">
                  <div className="bg-[#73A580]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {metric.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-dark-purple">{metric.title}</h3>
                  <p className="text-dark-purple/80">{metric.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Donation Form */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2 text-dark-purple">Make Your Donation</h2>
              <div className="w-32 h-1 bg-mustard mx-auto mb-6 rounded-full"></div>
              <p className="text-dark-purple/80 max-w-3xl mx-auto mb-8">
                Complete the form below to make your donation. All donations go directly toward providing 
                healthcare services to those in need.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 border-[#73A580]/30">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-dark-purple">Your Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Donation Details */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-dark-purple">Donation Details</h3>
                      
                      {selectedPatient && (
                        <div className="bg-[#73A580]/10 p-4 rounded-lg flex gap-3 items-center">
                          <div className="shrink-0">
                            <div className="h-16 w-16 rounded-full overflow-hidden relative">
                              <Image 
                                src={patients.find(p => p.id === selectedPatient)?.image || ''} 
                                alt="Selected patient"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-dark-purple font-semibold">
                              Supporting: {patients.find(p => p.id === selectedPatient)?.name}
                            </p>
                            <p className="text-dark-purple/70 text-sm">
                              {patients.find(p => p.id === selectedPatient)?.condition}
                            </p>
                            <Button 
                              type="button" 
                              variant="link" 
                              size="sm" 
                              className="text-suubi-green p-0 h-auto"
                              onClick={() => handlePatientSelect(selectedPatient)}
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="donationAmount"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Select Donation Amount</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 md:grid-cols-3 gap-3"
                              >
                                {donationOptions.map(option => (
                                  <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <FormLabel htmlFor={option.value} className="font-normal cursor-pointer">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {donationAmount === 'custom' && (
                        <FormField
                          control={form.control}
                          name="customAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enter Custom Amount (UGX)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="Enter amount" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="dedicateGift"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              I would like to dedicate this gift in honor or memory of someone
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {dedicateGift && (
                        <FormField
                          control={form.control}
                          name="honorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>In Honor/Memory of</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your words of encouragement or why you're donating"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Terms and Submission */}
                    <div className="space-y-6 pt-2">
                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">
                                I agree to the <Link href="/terms" className="text-suubi-green hover:underline">terms and conditions</Link> and understand how my donation will be used
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white group"
                        disabled={isSubmitting || isSuccess}
                      >
                        {isSubmitting ? 'Processing...' : isSuccess ? 'Donation Complete!' : 'Complete Donation'}
                        {!isSubmitting && !isSuccess && (
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        )}
                        {isSuccess && <Check className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </Form>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Transparency Section */}
      <section className="py-16 bg-[#F5F7F9]">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-2 text-dark-purple">How Your Money Is Used</h2>
            <div className="w-32 h-1 bg-mustard mx-auto mb-6 rounded-full"></div>
            <p className="text-dark-purple/80 mb-8">
              We are committed to transparency in how your donations are used. We ensure that the maximum amount of your 
              contribution goes directly to patient care.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-mustard mb-2">85%</div>
                <p className="text-dark-purple font-medium">Direct Patient Care</p>
                <p className="text-dark-purple/70 text-sm">Medications, treatments, and healthcare services</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-suubi-green mb-2">10%</div>
                <p className="text-dark-purple font-medium">Community Outreach</p>
                <p className="text-dark-purple/70 text-sm">Health education and preventive programs</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-dark-purple mb-2">5%</div>
                <p className="text-dark-purple font-medium">Administration</p>
                <p className="text-dark-purple/70 text-sm">Essential operations and program management</p>
              </div>
            </div>
            
            <div className="mt-12">
              <Button asChild variant="outline" className="border-mustard text-dark-purple hover:bg-mustard/10">
                <Link href="/about">
                  Learn More About Our Work
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 