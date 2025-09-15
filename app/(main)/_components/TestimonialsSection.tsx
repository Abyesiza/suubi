import Lifeline from '@/components/ui/Lifeline';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-background via-teal-tint/5 to-background">
      <div className="container-custom px-4">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-dark-purple px-4">
            Patient Stories
          </h2>
          <div className="w-32 md:w-40 h-4 md:h-6 mx-auto mb-3 md:mb-4">
            <Lifeline color="#F7941D" height="8px" variant="minimal" className="md:h-3" />
          </div>
          <p className="text-dark-purple/80 max-w-2xl mx-auto text-sm md:text-base lg:text-lg px-4">
            Real experiences from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          <TestimonialCard
            quote="The doctors actually listen and focus on prevention. Healthcare reimagined!"
            name="Sarah Johnson"
            title="Patient since 2022"
            rating={5}
          />
          <TestimonialCard
            quote="Exceptional care and always on time. This is how healthcare should be."
            name="Michael Chen"
            title="Patient since 2021"
            rating={5}
          />
        </div>
      </div>
    </section>
  );
} 