'use client';

import { motion } from 'framer-motion';
import Lifeline from './Lifeline';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  className?: string;
}

export default function Loader({ 
  size = 'md', 
  color = '#FF9933',
  text,
  className = '' 
}: LoaderProps) {
  const sizeMap = {
    sm: {
      container: 'w-20 h-10',
      lifeline: { width: '100%', height: '20px' }
    },
    md: {
      container: 'w-32 h-16',
      lifeline: { width: '100%', height: '30px' }
    },
    lg: {
      container: 'w-48 h-20',
      lifeline: { width: '100%', height: '40px' }
    }
  };

  const sizeConfig = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeConfig.container}`}>
        <Lifeline 
          variant="loader" 
          color={color} 
          width={sizeConfig.lifeline.width} 
          height={sizeConfig.lifeline.height} 
        />
      </div>
      {text && (
        <motion.p 
          className="mt-4 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            transition: { 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
} 