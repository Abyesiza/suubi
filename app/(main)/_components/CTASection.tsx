
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Link from 'next/link';
import Lifeline from '@/components/ui/Lifeline';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'; 

export default function CTASection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-brand-sky/10 to-accent/5">
      <div className="container-custom px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-teal to-brand-navy text-center shadow-brand-xl border border-white/10"
          >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.15),transparent_50%)]" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(46,139,87,0.12),transparent_50%)]" aria-hidden />
          
          <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Ready to take control of your health?
            </h2>
            
            <p className="text-white/85 text-base md:text-lg lg:text-xl mb-8 md:mb-10 lg:mb-12 leading-relaxed">
              Join the Suubi family today and experience healthcare reimagined. Our team of experts is ready to guide you on your wellness journey.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center">
              <Link href="/register-patient" className="cta-primary">
                Join Suubi Today
              </Link>
              <Link href="/services" className="cta-secondary">
                View Our Services
              </Link>
              <Link href="/contact" className="cta-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 