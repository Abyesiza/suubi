'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WaveProps {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
  animated?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export default function Wave({
  color = 'currentColor',
  width = '100%',
  height = '40px',
  className,
  animated = true,
  direction = 'horizontal',
}: WaveProps) {
  const isVertical = direction === 'vertical';
  
  // SVG viewbox and dimensions
  const viewBox = isVertical ? '0 0 40 200' : '0 0 200 40';
  const containerStyles = isVertical
    ? { width: height, height: width }
    : { width, height };
  
  // Define the wave path - more gentle than a heartbeat
  const wavePath = isVertical
    ? 'M20 0 C20 0, 10 20, 20 30 C30 40, 10 60, 20 70 C30 80, 10 100, 20 110 C30 120, 10 140, 20 150 C30 160, 10 180, 20 200'
    : 'M0 20 C20 10, 40 30, 60 20 C80 10, 100 30, 120 20 C140 10, 160 30, 180 20 C190 15, 200 20, 200 20';

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  };
  
  const flowVariants = {
    start: { 
      pathOffset: 0 
    },
    end: { 
      pathOffset: 1,
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }
    }
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={containerStyles}
    >
      <svg
        viewBox={viewBox}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {/* Base wave path */}
        <path
          d={wavePath}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.2"
        />
        
        {/* Animated wave path */}
        {animated && (
          <>
            <motion.path
              d={wavePath}
              fill="none"
              stroke={color}
              strokeWidth="2"
              initial="hidden"
              animate="visible"
              variants={pathVariants}
            />
            <motion.path
              d={wavePath}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              initial="start"
              animate="end"
              variants={flowVariants}
              opacity="0.6"
            />
          </>
        )}
      </svg>
    </div>
  );
} 