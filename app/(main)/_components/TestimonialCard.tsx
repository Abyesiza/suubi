import { Star } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import Lifeline from '@/components/ui/Lifeline';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  rating: number;
}

export default function TestimonialCard({ quote, name, title, rating }: TestimonialCardProps) {
  return (
    <CardContainer rotationFactor={15} perspective={1000}>
      <CardBody 
        variant="auto" 
        background="white" 
        shadow="lg"
        minHeight="160px"
        className="border-brand-eucalyptus/25 hover:border-brand-teal/50 transition-colors"
      >
        <div className="p-4 md:p-6">

          
          {/* Quote Text */}
          <CardItem translateZ="50" className="mb-4 md:mb-6">
            <p className="text-brand-navy/75 text-sm md:text-base leading-relaxed">
              "{quote}"
            </p>
          </CardItem>
          
          {/* Author Info */}
          <CardItem translateZ="60">
            <div className="border-t border-brand-navy/15 pt-3 md:pt-4">
              <p className="font-semibold text-brand-navy text-sm md:text-base">{name}</p>
              <p className="text-brand-navy/60 text-xs md:text-sm">{title}</p>
            </div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
} 