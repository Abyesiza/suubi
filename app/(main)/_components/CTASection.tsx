
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Link from 'next/link';
import Lifeline from '@/components/ui/Lifeline';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'; 

export default function CTASection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-warm-beige">
      <div className="container-custom px-4">
        <CardContainer 
          containerClassName="py-4 md:py-6 lg:py-8"
          rotationFactor={30}
          perspective={1200}
        >
          <CardBody 
            variant="auto" 
            background="dark"
            shadow="xl"
            rounded="2xl"
            minHeight="200px"
            className="bg-gradient-to-br from-dark-purple via-[#2E4A6B] to-dark-purple text-center relative overflow-hidden border-suubi-green/30"
          >
            {/* Top Lifeline */}
            <CardItem translateZ="10" className="absolute top-0 right-0 w-full h-6 md:h-8 lg:h-10 transform rotate-180">
              <Lifeline color="#F7941D" height="12px" variant="thin" className="opacity-40 md:h-4 lg:h-5" />
            </CardItem>
            
            {/* Main Content */}
            <div className="max-w-2xl mx-auto relative z-10 p-4 md:p-6 lg:p-8">
              <CardItem translateZ="60" className="mb-3 md:mb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  Ready to take control of your health?
                </h2>
              </CardItem>
              
              <CardItem translateZ="50" className="mb-4 md:mb-6 lg:mb-8">
                <p className="text-white/80 text-sm md:text-base lg:text-lg">
                  Join the Suubi family today and experience healthcare reimagined. Our team of experts is ready to guide you on your wellness journey.
                </p>
              </CardItem>
              
              <CardItem translateZ="80" className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 justify-center">
                <Link href="/register">
                  <HoverBorderGradient containerClassName="rounded-full" className="font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                    Join Suubi Today
                  </HoverBorderGradient>
                </Link>
                <Link href="/services">
                  <HoverBorderGradient containerClassName="rounded-full" className="font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                    View Our Services
                  </HoverBorderGradient>
                </Link>
                <Link href="/contact">
                  <HoverBorderGradient containerClassName="rounded-full" className="font-semibold text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                    Contact Us
                  </HoverBorderGradient>
                </Link>
              </CardItem>
            </div>
            
            {/* Bottom Lifeline */}
            <CardItem translateZ="10" className="absolute bottom-0 left-0 w-full h-6 md:h-8 lg:h-10">
              <Lifeline color="#F7941D" height="12px" variant="thin" className="opacity-40 md:h-4 lg:h-5" />
            </CardItem>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
} 