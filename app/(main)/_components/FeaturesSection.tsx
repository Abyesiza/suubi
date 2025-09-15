import { Calendar, Users, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import FeatureCard from './FeatureCard';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Lifeline from '@/components/ui/Lifeline';

export default function FeaturesSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-teal-tint/10 via-background to-teal-tint/5">
      <div className="container-custom px-4">
        <div className="flex justify-center mb-4 md:mb-6">
          <Loader size="sm" text="Finding the best solutions for you" />
        </div>
        
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-dark-purple px-4">
            Why Choose Suubi Healthcare?
          </h2>
          <div className="w-32 md:w-40 h-4 md:h-6 mx-auto mb-3 md:mb-4">
            <Lifeline color="#F7941D" height="8px" variant="minimal" className="md:h-3" />
          </div>
          <p className="text-dark-purple/70 max-w-2xl mx-auto text-sm md:text-base lg:text-lg px-4">
            Experience healthcare that puts your wellbeing first with our comprehensive services and caring approach.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 md:h-8 md:w-8 text-suubi-green" />}
            title="Easy Scheduling"
            description="Book appointments online with just a few clicks"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 md:h-8 md:w-8 text-suubi-green" />}
            title="Expert Doctors"
            description="Consult with our experienced healthcare professionals"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 md:h-8 md:w-8 text-mustard" />}
            title="24/7 Support"
            description="Round-the-clock assistance for your health needs"
          />
          <FeatureCard
            icon={<Activity className="h-6 w-6 md:h-8 md:w-8 text-suubi-green" />}
            title="Health Tracking"
            description="Monitor your health progress effectively"
          />
        </div>
        <div className="flex justify-center mt-6 md:mt-8">
          <Link href="/services">
            <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-6 md:px-8 py-3 md:py-4">
              Explore Our Services
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </section>
  );
} 