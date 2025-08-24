
import Link from 'next/link';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import Lifeline from '@/components/ui/Lifeline';

export default function HealthCheckSection() {
  return (
    <section className="bg-gradient-to-b from-teal-tint/5 to-background py-8 md:py-12 lg:py-16">
      <div className="container-custom px-4">
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-dark-purple px-4">
            How are you feeling today?
          </h2>
          <div className="w-32 md:w-40 h-4 md:h-6 mx-auto mb-3 md:mb-4">
            <Lifeline color="#F7941D" height="8px" variant="minimal" className="md:h-3" />
          </div>
          <p className="text-dark-purple/80 text-sm md:text-base lg:text-lg px-4">
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
            className="mx-auto border-suubi-green/30 hover:border-suubi-green/50 transition-colors"
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
                  <Lifeline color="#2E8B57" height="6px" variant="minimal" className="md:h-2" />
                </div>
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
} 