'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  Pill,
  User,
  HeartPulse,
  Check,
  Heart,
  Sparkles,
  Users,
  Target,
  Gift,
} from 'lucide-react';
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

// Featured patient stories
const patients = [
  {
    id: 1,
    name: 'Sarah Namuwange',
    condition: 'Diabetes',
    story: 'Sarah is a 42-year-old mother of four who has been struggling with diabetes for the past 5 years. Without regular medication, she faces severe health complications.',
    needs: 'Monthly medication, glucose monitoring supplies, and nutritional support',
    amount: 350000,
    raised: 180000,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=600&h=800'
  },
  {
    id: 2,
    name: 'Joshua Mutumba',
    condition: 'Post-surgical care',
    story: 'Joshua, 12, recently underwent surgery to correct a congenital heart defect. His family cannot afford the follow-up care needed for his recovery.',
    needs: 'Follow-up medical visits, medication, and specialized nutrition',
    amount: 580000,
    raised: 320000,
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600&h=800'
  },
  {
    id: 3,
    name: 'Agnes Nabukenya',
    condition: 'Maternal Health',
    story: 'Agnes is expecting her first child and lives in a remote village without access to prenatal care. She needs regular check-ups for a safe pregnancy.',
    needs: 'Prenatal vitamins, medical check-ups, and safe delivery services',
    amount: 420000,
    raised: 290000,
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?q=80&w=600&h=800'
  }
];

const donationOptions = [
  { value: '50000', label: '50,000 UGX', impact: 'Provides basic medication for one month' },
  { value: '100000', label: '100,000 UGX', impact: 'Covers a full medical check-up' },
  { value: '200000', label: '200,000 UGX', impact: 'Supports a week of treatment' },
  { value: '500000', label: '500,000 UGX', impact: 'Funds a complete treatment cycle' },
  { value: 'custom', label: 'Custom Amount', impact: 'Every contribution helps' }
];

const impactMetrics = [
  {
    title: 'Medication',
    description: '50,000 UGX provides a month of essential medication',
    icon: Pill,
    color: 'bg-brand-teal/10 text-brand-teal',
  },
  {
    title: 'Medical Care',
    description: '100,000 UGX covers a comprehensive medical check-up',
    icon: HeartPulse,
    color: 'bg-brand-eucalyptus/10 text-brand-eucalyptus',
  },
  {
    title: 'Full Support',
    description: "500,000 UGX supports a patient's complete treatment",
    icon: User,
    color: 'bg-brand-orange/10 text-brand-orange',
  }
];

const stats = [
  { value: '85%', label: 'Direct Patient Care', description: 'Medications & treatments' },
  { value: '10%', label: 'Community Outreach', description: 'Health education' },
  { value: '5%', label: 'Administration', description: 'Operations' },
];

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  patientId: z.string().optional(),
  donationAmount: z.enum(['50000', '100000', '200000', '500000', 'custom']),
  customAmount: z.string().optional(),
  dedicateGift: z.boolean().default(false),
  honorName: z.string().optional(),
  message: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, { message: 'You must agree to proceed.' }),
});

export default function DonatePage() {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('Donation data:', values);
      setIsSubmitting(false);
      setIsSuccess(true);

      toast.success('Thank you for your donation!', {
        description: 'Your support makes a real difference.',
      });

      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        setSelectedPatient(null);
      }, 3000);
    }, 1500);
  }

  const handlePatientSelect = (id: number) => {
    setSelectedPatient(id === selectedPatient ? null : id);
    form.setValue('patientId', id === selectedPatient ? undefined : id.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">
                <Heart className="w-3 h-3 mr-1" />
                Support Our Mission
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-heading"
            >
              Your Donation Saves Lives
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Your donation provides essential medical care to patients in underserved communities.
              Every contribution makes a meaningful difference in someone's life.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button size="lg" className="bg-brand-orange hover:bg-brand-orange/90" asChild>
                <a href="#donate-form">
                  <Gift className="mr-2 h-4 w-4" />
                  Donate Now
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/register-patient">
                  <Users className="mr-2 h-4 w-4" />
                  Register a Patient
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
          <Heart className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
          <Gift className="w-32 h-32 text-white" />
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {impactMetrics.map((metric, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card className="h-full text-center hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 mx-auto rounded-xl ${metric.color} flex items-center justify-center mb-4`}>
                      <metric.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{metric.title}</h3>
                    <p className="text-muted-foreground">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Patients */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-teal/10 text-brand-teal">Patient Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Help Those In Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet some of the patients whose lives can be transformed through your generosity.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {patients.map((patient, index) => (
              <motion.div key={patient.id} variants={itemVariants}>
                <Card
                  className={`h-full overflow-hidden cursor-pointer transition-all ${selectedPatient === patient.id
                      ? 'ring-2 ring-brand-orange shadow-lg'
                      : 'hover:shadow-lg'
                    }`}
                  onClick={() => handlePatientSelect(patient.id)}
                >
                  <div className="relative h-52">
                    <Image
                      src={patient.image}
                      alt={patient.name}
                      fill
                      className="object-cover"
                    />
                    {selectedPatient === patient.id && (
                      <div className="absolute top-3 right-3 bg-brand-orange rounded-full p-1.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-white/90 text-foreground">{patient.condition}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{patient.story}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Raised</span>
                        <span className="font-semibold">{patient.raised.toLocaleString()} / {patient.amount.toLocaleString()} UGX</span>
                      </div>
                      <Progress value={(patient.raised / patient.amount) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Donation Form */}
      <section id="donate-form" className="py-16 md:py-24 bg-muted/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-brand-orange/10 text-brand-orange">Donate</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Make Your Donation</h2>
              <p className="text-muted-foreground">
                Complete the form below to support our mission.
              </p>
            </div>

            <Card className="overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-brand-orange to-brand-amber" />
              <CardContent className="p-6 md:p-8">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto bg-brand-eucalyptus/10 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-brand-eucalyptus" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Donation Complete!</h3>
                    <p className="text-muted-foreground">Thank you for your generosity.</p>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Info */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="h-4 w-4 text-brand-teal" />
                          Your Information
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
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
                      </div>

                      {/* Selected Patient */}
                      {selectedPatient && (
                        <div className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-full overflow-hidden">
                              <Image
                                src={patients.find(p => p.id === selectedPatient)?.image || ''}
                                alt="Selected patient"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                Supporting: {patients.find(p => p.id === selectedPatient)?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {patients.find(p => p.id === selectedPatient)?.condition}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePatientSelect(selectedPatient)}
                            >
                              Change
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Donation Amount */}
                      <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Gift className="h-4 w-4 text-brand-orange" />
                          Donation Amount
                        </h3>
                        <FormField
                          control={form.control}
                          name="donationAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                                >
                                  {donationOptions.map(option => (
                                    <div key={option.value}>
                                      <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="peer sr-only"
                                      />
                                      <label
                                        htmlFor={option.value}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-brand-orange peer-data-[state=checked]:bg-brand-orange/5 hover:border-brand-orange/50"
                                      >
                                        <span className="font-semibold">{option.label}</span>
                                        <span className="text-xs text-muted-foreground text-center mt-1 hidden sm:block">
                                          {option.impact}
                                        </span>
                                      </label>
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
                                <FormLabel>Custom Amount (UGX)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="Enter amount" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      {/* Dedication */}
                      <FormField
                        control={form.control}
                        name="dedicateGift"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Dedicate this gift in honor or memory of someone
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
                            <FormLabel>Message (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your words of encouragement..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Terms */}
                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">
                                I agree to the{' '}
                                <Link href="/terms" className="text-brand-teal hover:underline">
                                  terms and conditions
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-brand-orange hover:bg-brand-orange/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Complete Donation'}
                        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-navy to-brand-teal p-8 md:p-12 text-white"
          >
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20">
                <Target className="w-3 h-3 mr-1" />
                Transparency
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Your Money Is Used</h2>
              <p className="text-white/80 mb-10">
                We are committed to transparency. The maximum amount of your contribution goes directly to patient care.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/10"
                  >
                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="font-semibold mb-1">{stat.label}</div>
                    <div className="text-sm text-white/70">{stat.description}</div>
                  </motion.div>
                ))}
              </div>

              <Button asChild size="lg" className="mt-10 bg-white text-brand-navy hover:bg-white/90">
                <Link href="/about">
                  Learn More About Our Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
