import { Calendar, Users, Clock, Activity } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';
import FeatureCard from './FeatureCard';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Lifeline from '@/components/ui/Lifeline';

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-brand-sky/15 via-background to-brand-sky/5">
      <div className="container-custom px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-brand-navy mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
            What Makes Us Different
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-brand-navy px-4">
            Why Choose Suubi Healthcare?
          </h2>
          <p className="text-brand-navy/70 max-w-2xl mx-auto text-base md:text-lg lg:text-xl px-4 leading-relaxed">
            Experience healthcare that puts your wellbeing first with our comprehensive services and caring approach.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 md:h-8 md:w-8 text-brand-eucalyptus" />}
            title="Easy Scheduling"
            description="Book appointments online with just a few clicks"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 md:h-8 md:w-8 text-brand-teal" />}
            title="Expert Doctors"
            description="Consult with our experienced healthcare professionals"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 md:h-8 md:w-8 text-brand-amber" />}
            title="24/7 Support"
            description="Round-the-clock assistance for your health needs"
          />
          <FeatureCard
            icon={<Activity className="h-6 w-6 md:h-8 md:w-8 text-brand-eucalyptus" />}
            title="Health Tracking"
            description="Monitor your health progress effectively"
          />
        </div>
        <div className="flex justify-center mt-12 md:mt-16">
          <Link href="/services" className="btn-outline-brand">
            Explore Our Services
          </Link>
        </div>
      </div>
    </section>
  );
} 