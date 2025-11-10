import Lifeline from '@/components/ui/Lifeline';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-brand-sky/10">
      <div className="container-custom px-4">
        <div className="mb-12 md:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-brand-navy mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
            Trusted by Families
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-brand-navy px-4">
            Patient Stories
          </h2>
          <p className="text-brand-navy/70 max-w-2xl mx-auto text-base md:text-lg lg:text-xl px-4 leading-relaxed">
            Real experiences from our community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <TestimonialCard
            quote="The doctors actually listen and focus on prevention. Healthcare reimagined!"
            name="Margaret Namukasa"
            title="Patient since 2024"
            rating={5}
          />
          <TestimonialCard
            quote="Exceptional care and always on time. This is how healthcare should be."
            name="Kamuhanga Samuel"
            title="Patient since 2025"
            rating={5}
          />
        </div>
      </div>
    </section>
  );
} 