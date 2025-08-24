import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Link from 'next/link';
import Lifeline from '@/components/ui/Lifeline';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function DonationSection() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-warm-beige">
      <div className="container-custom px-4">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-dark-purple px-4">
            Be a Healthcare Hero
          </h2>
          <div className="w-32 md:w-40 h-4 md:h-6 mx-auto mb-3 md:mb-4">
            <Lifeline color="#F7941D" height="8px" variant="minimal" className="md:h-3" />
          </div>
          <p className="text-dark-purple/80 text-sm md:text-base lg:text-lg px-4">
            Your generosity can save lives. Every donation helps provide essential medical care to those who need it most.
          </p>
        </div>
        
        <CardContainer rotationFactor={25} perspective={1200}>
          <CardBody 
            variant="auto" 
            background="white" 
            shadow="xl"
            minHeight="250px"
            maxWidth="1000px"
            className="mx-auto border-mustard/30 hover:border-mustard/50 transition-colors"
          >
            <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6 lg:gap-8 p-4 md:p-6 lg:p-8">
              <div className="flex-1 w-full lg:w-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-3 md:space-y-4 lg:space-y-6"
                >
                  <CardItem translateZ="60">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark-purple">Making a Difference Together</h3>
                  </CardItem>
                  
                  <CardItem translateZ="50">
                    <p className="text-dark-purple/80 text-base md:text-lg">
                      Your support helps us provide medical care to underserved communities and individuals who cannot afford healthcare services.
                    </p>
                  </CardItem>
                  
                  <CardItem translateZ="70" className="flex gap-3 md:gap-4 flex-wrap">
                    <Link href="/donate">
                      <HoverBorderGradient containerClassName="rounded-full" className="font-medium text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                        Donate Now
                      </HoverBorderGradient>
                    </Link>
                    <Link href="/register-patient">
                      <HoverBorderGradient containerClassName="rounded-full" className="font-medium text-sm md:text-base px-4 md:px-6 py-2 md:py-3">
                        Register Someone
                      </HoverBorderGradient>
                    </Link>
                  </CardItem>
                </motion.div>
              </div>
              
              <div className="flex-1 w-full lg:w-auto">
                <CardItem translateZ="80" className="relative">
                  <div className="relative h-40 md:h-48 lg:h-64 rounded-xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-mustard/30 to-suubi-green/20 z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1170" 
                      alt="Medical volunteer helping a patient" 
                      className="w-full h-full object-cover"
                    />
                    {/* Decorative lifeline overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 z-20">
                      <Lifeline color="#F7941D" height="8px" variant="minimal" className="opacity-60 md:h-3" />
                    </div>
                  </div>
                </CardItem>
              </div>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </section>
  );
} 