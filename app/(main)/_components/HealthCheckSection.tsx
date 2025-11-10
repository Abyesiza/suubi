
import Link from 'next/link';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import Lifeline from '@/components/ui/Lifeline';

export default function HealthCheckSection() {
  return (
    <section className="bg-gradient-to-b from-brand-sky/8 to-background py-16 md:py-20 lg:py-24">
      <div className="container-custom px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-brand-navy mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
            Quick Check-In
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-brand-navy px-4">
            How are you feeling today?
          </h2>
          <p className="text-brand-navy/70 text-base md:text-lg lg:text-xl px-4 leading-relaxed">
            Take our quick health assessment to get personalized recommendations
          </p>
        </div>
        
        <CardContainer rotationFactor={30} perspective={1200}>
          <CardBody 
            variant="auto" 
            background="white" 
            shadow="xl"
            minHeight="180px"
            maxWidth="800px"
            className="mx-auto border-brand-eucalyptus/30 hover:border-brand-teal/50 transition-colors"
          >
            <div className="p-4 md:p-6 lg:p-8">
              <CardItem translateZ="50" className="mb-4 md:mb-6">
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                  <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-3 md:px-4 py-2 md:py-3">
                    😊 Great
                  </HoverBorderGradient>
                  <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-3 md:px-4 py-2 md:py-3">
                    😐 Okay
                  </HoverBorderGradient>
                  <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-3 md:px-4 py-2 md:py-3">
                    😔 Not Well
                  </HoverBorderGradient>
                  <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-3 md:px-4 py-2 md:py-3">
                    🤒 Sick
                  </HoverBorderGradient>
                </div>
              </CardItem>
              
              <CardItem translateZ="70" className="text-center">
                <Link href="/health-assessment">
                  <HoverBorderGradient containerClassName="rounded-full" className="font-medium justify-center items-center text-sm md:text-base px-6 md:px-8 py-3 md:py-4">
                    Get Health Recommendations
                  </HoverBorderGradient>
                </Link>
              </CardItem>
              
              {/* Decorative lifeline at bottom */}
              <CardItem translateZ="20" className="mt-4 md:mt-6">
                <div className="w-full h-3 md:h-4 opacity-30">
                  <Lifeline color="#3C8C7F" height="6px" variant="minimal" className="md:h-2" />
                </div>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
} 