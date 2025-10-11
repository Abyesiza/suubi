'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(9, {
    message: "Please enter a valid Ugandan phone number.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Form submission handler
  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/send-email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Failed to send message');
      }
      
      // Show success message
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Contact form submission failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-dark-purple">Contact Us</h1>
          <div className="w-48 h-6 mx-auto mb-4">
            <Lifeline color="#E1AD01" height="12px" variant="minimal" />
          </div>
          <p className="text-dark-purple/80 max-w-2xl mx-auto">
            Have questions or need to schedule an appointment? We're here to help.
            Reach out to us through the contact form or using our contact information below.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 border-[#73A580]/30 h-full">
              <h2 className="text-2xl font-semibold mb-6 text-dark-purple">Get in Touch</h2>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[400px] text-center"
                >
                  <div className="w-16 h-16 bg-suubi-green/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-suubi-green" />
                  </div>
                  <h3 className="text-xl font-medium text-dark-purple mb-2">Message Sent Successfully!</h3>
                  <p className="text-dark-purple/70">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark-purple">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Mukasa John" {...field} className="border-[#73A580]/30 focus-visible:ring-suubi-green" />
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
                            <FormLabel className="text-dark-purple">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="yourname@gmail.com" {...field} className="border-[#73A580]/30 focus-visible:ring-suubi-green" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark-purple">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+256 700 000 000" {...field} className="border-[#73A580]/30 focus-visible:ring-suubi-green" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-dark-purple">Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-[#73A580]/30 focus:ring-suubi-green">
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                <SelectItem value="Appointment Request">Appointment Request</SelectItem>
                                <SelectItem value="Medical Consultation">Medical Consultation</SelectItem>
                                <SelectItem value="Test Results">Test Results</SelectItem>
                                <SelectItem value="Prescription Refill">Prescription Refill</SelectItem>
                                <SelectItem value="Billing & Insurance">Billing & Insurance</SelectItem>
                                <SelectItem value="Emergency Services">Emergency Services</SelectItem>
                                <SelectItem value="Feedback & Complaints">Feedback & Complaints</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dark-purple">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your medical inquiry or appointment needs..." 
                              className="min-h-[120px] border-[#73A580]/30 focus-visible:ring-suubi-green" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </Card>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 border-[#73A580]/30 h-full">
              <h2 className="text-2xl font-semibold mb-6 text-dark-purple">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#73A580]/20 p-2 rounded-full flex-shrink-0 mt-1">
                    <MapPin className="h-5 w-5 text-mustard" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple mb-1">Our Location</h3>
                    <p className="text-dark-purple/70">
                      Level 1 Ssebowa House,<br />
                      Plot 1 Ssekajja Road, Kayunga Central<br />
                      Kayunga, Uganda
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#73A580]/20 p-2 rounded-full flex-shrink-0 mt-1">
                    <Phone className="h-5 w-5 text-mustard" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple mb-1">Phone</h3>
                    <p className="text-dark-purple/70">
                      Main: +256 772 670 744<br />
                      Emergency: +256 700 304 407
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#73A580]/20 p-2 rounded-full flex-shrink-0 mt-1">
                    <Mail className="h-5 w-5 text-mustard" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple mb-1">Email</h3>
                    <p className="text-dark-purple/70">
                      suubimedcarekayunga@gmail.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#73A580]/20 p-2 rounded-full flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-mustard" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-dark-purple mb-1">Operating Hours</h3>
                    <div className="text-dark-purple/70 space-y-1">
                      <div className="flex justify-between">
                        <span>Monday - Sunday:</span>
                        <span>24 Hours</span>
                      </div>
                      <div className="text-sm text-mustard font-medium">
                        Open every day of the week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map or Location Indicator */}
              <div className="mt-8 border border-[#73A580]/30 rounded-md overflow-hidden h-[200px] relative">
                <div className="absolute inset-0 bg-[#73A580]/10 flex items-center justify-center">
                  <p className="text-dark-purple/50 text-center px-4">
                    Map location will be displayed here.<br />
                    <span className="text-sm">(To implement with Google Maps or similar service)</span>
                  </p>
                </div>
                {/* Decorative Lifeline */}
                <div className="absolute bottom-0 left-0 right-0 h-6">
                  <Lifeline color="#E1AD01" height="12px" variant="thin" className="opacity-30" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-[#73A580]/20 rounded-xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-8">
            <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-40" />
          </div>
          
          <div className="max-w-2xl mx-auto py-6">
            <h2 className="text-2xl font-bold mb-4 text-dark-purple">Need Urgent Care?</h2>
            <p className="text-dark-purple/80 mb-6">
              Our emergency services are available 24/7. For urgent medical attention, 
              please call our emergency line or visit our facility immediately.
            </p>
            <Button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors px-8">
              Call Emergency: +256 700 304 407
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <Lifeline color="#E1AD01" height="16px" variant="thin" className="opacity-40 transform rotate-180" />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 