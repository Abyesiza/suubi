import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <CardContainer rotationFactor={25} perspective={1000}>
      <CardBody 
        variant="auto" 
        background="white" 
        shadow="lg"
        minHeight="200px"
        className="text-center border-suubi-green/20 hover:border-suubi-green/40 transition-colors"
      >
        <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col justify-center">
          <CardItem translateZ="60" className="flex justify-center mb-4 md:mb-6">
            {icon}
          </CardItem>
          <CardItem translateZ="50" className="mb-3 md:mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-dark-purple">{title}</h3>
          </CardItem>
          <CardItem translateZ="40">
            <p className="text-dark-purple/70 leading-relaxed text-sm md:text-base">{description}</p>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
} 