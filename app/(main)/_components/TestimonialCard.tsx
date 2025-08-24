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
        className="border-suubi-green/20 hover:border-suubi-green/40 transition-colors"
      >
        <div className="p-4 md:p-6">
          {/* Quote Icon */}
          <CardItem translateZ="30" className="mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-suubi-green/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-suubi-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </div>
          </CardItem>
          
          {/* Quote Text */}
          <CardItem translateZ="50" className="mb-4 md:mb-6">
            <p className="text-dark-purple/80 text-sm md:text-base leading-relaxed">
              "{quote}"
            </p>
          </CardItem>
          
          {/* Rating */}
          <CardItem translateZ="40" className="mb-3 md:mb-4">
            <div className="flex gap-1">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-mustard text-mustard" />
              ))}
            </div>
          </CardItem>
          
          {/* Author Info */}
          <CardItem translateZ="60">
            <div className="border-t border-light-gray pt-3 md:pt-4">
              <p className="font-semibold text-dark-purple text-sm md:text-base">{name}</p>
              <p className="text-dark-purple/60 text-xs md:text-sm">{title}</p>
            </div>
          </CardItem>
          
          {/* Bottom Lifeline */}
          <CardItem translateZ="20" className="mt-4 md:mt-6">
            <div className="w-full h-3 md:h-4 opacity-30">
              <Lifeline color="#2E8B57" height="6px" variant="minimal" className="md:h-2" />
            </div>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
} 