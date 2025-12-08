'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(9, { message: "Please enter a valid phone number." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Location',
    details: ['Level 1 Ssebowa House', 'Plot 1 Ssekajja Road, Kayunga Central', 'Kayunga, Uganda'],
    color: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['Main: +256 787 324 041', 'Emergency: +256 708 726 924'],
    color: 'bg-brand-eucalyptus/10 text-brand-eucalyptus',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['suubimedcarekayunga@gmail.com'],
    color: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    icon: Clock,
    title: 'Operating Hours',
    details: ['Monday - Sunday: 24 Hours', 'Open every day of the week'],
    color: 'bg-brand-amber/10 text-brand-amber',
    badge: 'Open 24/7',
  },
];

const subjects = [
  'General Inquiry',
  'Appointment Request',
  'Medical Consultation',
  'Test Results',
  'Prescription Refill',
  'Billing & Insurance',
  'Emergency Services',
  'Feedback & Complaints',
  'Other',
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      setIsSubmitted(true);
      toast.success('Message sent successfully!', {
        description: 'We will get back to you as soon as possible.',
      });

      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Contact form submission failed:', err);
      toast.error('Failed to send message', {
        description: err instanceof Error ? err.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
                Get In Touch
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Contact{' '}
              <span className="bg-gradient-to-r from-brand-teal to-brand-eucalyptus bg-clip-text text-transparent">
                Us
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Have questions or need to schedule an appointment? We're here to help.
              Reach out to us through the contact form or using our contact information below.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-8">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mb-4`}>
                      <info.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{info.title}</h3>
                      {info.badge && (
                        <Badge className="bg-brand-eucalyptus/10 text-brand-eucalyptus text-xs">
                          {info.badge}
                        </Badge>
                      )}
                    </div>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12 md:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-brand-teal to-brand-eucalyptus" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-brand-teal" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="w-16 h-16 bg-brand-eucalyptus/10 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-brand-eucalyptus" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Mukasa John" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="yourname@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+256 700 000 000" {...field} />
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
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {subjects.map((subject) => (
                                      <SelectItem key={subject} value={subject}>
                                        {subject}
                                      </SelectItem>
                                    ))}
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
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your inquiry or needs..."
                                  className="min-h-[120px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-brand-teal hover:bg-brand-teal/90"
                          disabled={isSubmitting}
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map & Emergency */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <Card className="overflow-hidden">
                <div className="relative h-[300px] bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-brand-teal mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Level 1 Ssebowa House<br />
                        Plot 1 Ssekajja Road<br />
                        Kayunga Central, Uganda
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Emergency Card */}
              <Card className="overflow-hidden bg-gradient-to-r from-brand-navy to-brand-teal text-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/10">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Need Urgent Care?</h3>
                      <p className="text-white/80 mb-4">
                        Our emergency services are available 24/7. For urgent medical attention,
                        please call our emergency line immediately.
                      </p>
                      <Button asChild size="lg" className="bg-white text-brand-navy hover:bg-white/90">
                        <a href="tel:+256708726924">
                          <Phone className="h-4 w-4 mr-2" />
                          +256 708 726 924
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="justify-start">
                      <a href="/appointments">
                        <Clock className="h-4 w-4 mr-2" />
                        Book Appointment
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <a href="/services">
                        <MapPin className="h-4 w-4 mr-2" />
                        Our Services
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <a href="/staff">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Find a Doctor
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="justify-start">
                      <a href="/health-assessment">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Health Check
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
