"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const submitInquiry = useMutation(api.contact.submitInquiry);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await submitInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        message: values.message,
      });

      setIsSuccess(true);
      toast.success("Message Sent Successfully", {
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again later or contact us directly via phone.",
      });
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-brand-navy pt-32 pb-32 text-white relative overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-heading"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            We are here to help. Reach out to us for any inquiries or emergencies.
          </motion.p>
        </div>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-y-1/4 translate-x-1/4">
          <MessageSquare className="w-[500px] h-[500px] text-white" />
        </div>
        <div className="absolute left-10 top-20 opacity-5 pointer-events-none">
          <Mail className="w-32 h-32 text-white" />
        </div>
      </section>

      <section className="py-24 relative -mt-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-brand-soft">
                <div className="w-12 h-12 bg-brand-teal/10 rounded-full flex items-center justify-center text-brand-teal mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">Our Location</h3>
                <p className="text-gray-600">
                  Level 1 Ssebowa House,<br />
                  Plot 1 Ssekajja Road,<br />
                  Kayunga Central, Kayunga, Uganda
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-brand-soft">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-2">Main: <a href="tel:+256787324041" className="text-brand-teal font-medium hover:underline">+256 787 324 041</a></p>
                <p className="text-gray-600">Emergency: <a href="tel:+256708726924" className="text-red-500 font-medium hover:underline">+256 708 726 924</a></p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-brand-soft">
                <div className="w-12 h-12 bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">Operating Hours</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Monday - Sunday:</span><br />
                  24 Hours
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-brand-navy">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email Us</p>
                      <a href="mailto:suubimedcarekayunga@gmail.com" className="text-sm font-semibold text-brand-teal hover:underline break-all">suubimedcarekayunga@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-brand-lg h-full">
                <h2 className="text-2xl font-bold text-brand-navy mb-6">Send us a Message</h2>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-[400px] text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy mb-2">Message Sent!</h3>
                    <p className="text-gray-600 max-w-md mb-8">
                      Thank you for reaching out. We have received your message and will get back to you shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" className="rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+256..." className="rounded-xl" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" className="rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="How can we help you?"
                                className="rounded-xl min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl py-6 text-lg"
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
