'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users, Clock, Activity, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Lifeline from '@/components/ui/Lifeline';
import Loader from '@/components/ui/Loader';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Hero slider images
const heroImages = [
  {
    url: '/img/dr1.jpg',
    alt: 'Doctor 1'
  },
  {
    url: '/img/dr2.jpg',
    alt: 'Doctor 2'
  },
  {
    url: '/img/dr3.jpg',
    alt: 'Doctor 3'
  },
  {
    url: '/img/dr4.jpg',
    alt: 'Doctor 4'
  }
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      {/* Clean, Simple Hero Section with new color palette */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Updated gradient background with new green */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#73A580]/20 to-[#73A580]/40 z-0"></div>
        
        {/* Horizontal lifeline at the top - updated to mustard yellow */}
        <div className="absolute top-16 left-0 right-0 w-full z-10">
          <Lifeline 
            color="#E1AD01" 
            height="30px" 
            variant="thin"
            className="opacity-60"
          />
        </div>
        
        <div className="container-custom relative z-20 pt-20 pb-16">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-mustard/20 text-dark-purple font-medium text-sm mb-6">
                Healthcare Reimagined
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-5 text-dark-purple leading-tight">
                We've reimagined healthcare for you.
              </h1>
              
              {/* Lifeline under the heading - updated to mustard yellow */}
              <div className="w-32 h-6 mb-5">
                <Lifeline color="#E1AD01" height="12px" variant="minimal" />
              </div>
              
              <p className="text-lg text-dark-purple/80 mb-8 max-w-xl">
                Suubi members receive integrative primary care, specialized services, and lifestyle medicine from top-tier doctors in a cutting-edge concierge medical program.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/appointments">
                  <Button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors px-5 py-2 rounded-lg">Book Appointment</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white transition-colors px-5 py-2 rounded-lg">Our Services</Button>
                </Link>
                <Link href="/doctors">
                  <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white transition-colors px-5 py-2 rounded-lg">Meet Our Doctors</Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Image Slider */}
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl">
                {/* Main image with animation */}
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[currentImageIndex].url}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Slider navigation buttons */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-2 rounded-full z-20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-2 rounded-full z-20"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Lifeline overlay on the image - updated to mustard yellow */}
                <div className="absolute bottom-0 left-0 right-0 h-16 z-10">
                  <Lifeline 
                    color="#E1AD01" 
                    height="24px" 
                    variant="thin"
                    className="opacity-60"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom lifeline - updated to mustard yellow */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-10">
          <Lifeline 
            color="#E1AD01" 
            height="30px" 
            variant="thin"
            className="opacity-60 transform rotate-180"
          />
        </div>
      </section>

      {/* Features Section - Updated colors */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex justify-center mb-8">
            <Loader size="sm" text="Finding the best solutions for you" />
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-12 text-dark-purple">Why Choose Suubi Healthcare?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-suubi-green" />}
              title="Easy Scheduling"
              description="Book appointments online with just a few clicks"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-suubi-green" />}
              title="Expert Doctors"
              description="Consult with our experienced healthcare professionals"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-mustard" />}
              title="24/7 Support"
              description="Round-the-clock assistance for your health needs"
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-suubi-green" />}
              title="Health Tracking"
              description="Monitor your health progress effectively"
            />
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/services">
              <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white transition-colors px-5 py-2 rounded-lg">
                Explore Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Health Check Section - Updated colors */}
      <section className="bg-[#73A580]/20 py-20">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-purple">How are you feeling today?</h2>
            <p className="text-dark-purple/80">
              Take our quick health assessment to get personalized recommendations
            </p>
          </div>
          <Card className="max-w-3xl mx-auto p-8 border-[#73A580]">
            <div className="grid gap-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" className="text-lg px-6 border-suubi-green text-dark-purple hover:bg-mustard hover:border-mustard">😊 Great</Button>
                <Button variant="outline" className="text-lg px-6 border-suubi-green text-dark-purple hover:bg-mustard hover:border-mustard">😐 Okay</Button>
                <Button variant="outline" className="text-lg px-6 border-suubi-green text-dark-purple hover:bg-mustard hover:border-mustard">😔 Not Well</Button>
                <Button variant="outline" className="text-lg px-6 border-suubi-green text-dark-purple hover:bg-mustard hover:border-mustard">🤒 Sick</Button>
              </div>
              <div className="text-center">
                <Link href="/health-assessment">
                  <Button className="bg-mustard hover:bg-suubi-green text-dark-purple hover:text-white transition-colors">Get Health Recommendations</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-mustard/10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-purple">Be a Healthcare Hero</h2>
            <div className="w-40 h-6 mx-auto mb-4">
              <Lifeline color="#E1AD01" height="12px" variant="minimal" />
            </div>
            <p className="text-dark-purple/80">
              Your generosity can save lives. Every donation helps provide essential medical care to those who need it most.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-dark-purple">Making a Difference Together</h3>
                  <p className="text-dark-purple/80">
                    Your support helps us provide medical care to underserved communities and individuals who cannot afford healthcare services.
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <Link href="/donate">
                      <Button className="bg-suubi-green hover:bg-suubi-green/80 text-white transition-colors">Donate Now</Button>
                    </Link>
                    <Link href="/register-patient">
                      <Button variant="outline" className="border-suubi-green text-suubi-green hover:bg-suubi-green hover:text-white">Register Someone</Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
              <div className="flex-1 w-full md:w-auto">
                <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-mustard/40 to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1170" 
                    alt="Medical volunteer helping a patient" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated colors */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-dark-purple rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-10 transform rotate-180">
              <Lifeline color="#E1AD01" height="20px" variant="thin" className="opacity-40" />
            </div>
            
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to take control of your health?</h2>
              <p className="text-white/80 mb-8">
                Join the Suubi family today and experience healthcare reimagined. Our team of experts is ready to guide you on your wellness journey.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <Button className="bg-mustard hover:bg-[#F7CA3E] text-dark-purple font-bold transition-colors">Join Suubi Today</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-dark-purple">View Our Services</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-dark-purple">Contact Us</Button>
                </Link>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-10">
              <Lifeline color="#E1AD01" height="20px" variant="thin" className="opacity-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - What Our Patients Say */}
      <section className="py-20 bg-[#3E363F]/5">
        <div className="container-custom">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-dark-purple">What Our Patients Say</h2>
            <div className="w-40 h-6 mx-auto mb-4">
              <Lifeline color="#E1AD01" height="12px" variant="minimal" />
            </div>
            <p className="text-dark-purple/80 max-w-2xl mx-auto">
              Hear from our satisfied patients about their healthcare journey with Suubi Healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Suubi Healthcare has transformed my approach to wellness. The doctors actually listen and focus on prevention."
              name="Sarah Johnson"
              title="Patient since 2022"
              rating={5}
            />
            <TestimonialCard
              quote="The level of care I received during my treatment was exceptional. The entire staff made me feel comfortable and informed."
              name="Michael Chen"
              title="Patient since 2021"
              rating={4}
            />
            <TestimonialCard
              quote="Booking appointments is so simple, and the doctors are always on time. This is healthcare reimagined!"
              name="Amara Williams"
              title="Patient since 2023"
              rating={5}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 text-center hover:shadow-xl transition-shadow border-[#73A580]/30">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-dark-purple">{title}</h3>
      <p className="text-dark-purple/70">{description}</p>
    </Card>
  );
}

function TestimonialCard({ quote, name, title, rating }: { quote: string; name: string; title: string; rating: number }) {
  return (
    <Card className="p-6 hover:shadow-xl transition-shadow border-[#73A580]/30 relative overflow-hidden">
      <Quote className="h-8 w-8 text-mustard/30 absolute top-4 right-4" />
      <p className="text-dark-purple/80 mb-6 relative z-10">{quote}</p>
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-mustard fill-mustard' : 'text-gray-300'}`} />
        ))}
      </div>
      <h4 className="font-semibold text-dark-purple">{name}</h4>
      <p className="text-sm text-dark-purple/70">{title}</p>
      
      {/* Subtle lifeline at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4">
        <Lifeline 
          color="#E1AD01" 
          height="8px" 
          variant="minimal" 
          className="opacity-20"
        />
      </div>
    </Card>
  );
}