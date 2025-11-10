import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';
import Link from 'next/link';
import Lifeline from '@/components/ui/Lifeline';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

export default function DonationSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-brand-sky/10">
      <div className="container-custom px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-brand-navy mb-6">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
            Make an Impact
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-brand-navy px-4">
            Be a Healthcare Hero
          </h2>
          <p className="text-brand-navy/70 text-base md:text-lg lg:text-xl px-4 leading-relaxed">
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
            className="mx-auto border-brand-amber/30 hover:border-brand-orange/50 transition-colors"
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
                    <h3 className="text-xl md:text-2xl font-semibold text-brand-navy">Making a Difference Together</h3>
                  </CardItem>
                  
                  <CardItem translateZ="50">
                    <p className="text-brand-navy/75 text-base md:text-lg">
                      Your support helps us provide medical care to underserved communities and individuals who cannot afford healthcare services.
                    </p>
                  </CardItem>
                  
                  <CardItem translateZ="70" className="flex gap-3 md:gap-4 flex-wrap">
                    <Link href="/donate" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-amber-500 px-6 py-3 text-base font-semibold text-white shadow-brand-lg transition-all duration-200 hover:shadow-brand-xl hover:-translate-y-[2px]">
                        Donate Now
                    </Link>
                    <Link href="/register-patient" className="btn-outline-brand">
                        Register Someone
                    </Link>
                  </CardItem>
                </motion.div>
              </div>
              
              <div className="flex-1 w-full lg:w-auto">
                <CardItem translateZ="80" className="relative">
                  <div className="relative h-40 md:h-48 lg:h-64 rounded-xl overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-amber/30 to-brand-eucalyptus/25 z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1170" 
                      alt="Medical volunteer helping a patient" 
                      className="w-full h-full object-cover"
                    />
                    {/* Decorative lifeline overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 md:h-6 z-20">
                      <Lifeline color="#FFB347" height="8px" variant="minimal" className="opacity-60 md:h-3" />
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