'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LifelineProps {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
  variant?: 'default' | 'thin' | 'minimal' | 'loader';
}

export default function Lifeline({ 
  color = '#FF9933', 
  width = '100%', 
  height = '100px',
  className = '',
  variant = 'default'
}: LifelineProps) {
  // SVG path for a heartbeat/ECG line that matches the image
  const path = "M0,50 L40,50 L45,20 L50,80 L55,50 L65,50 L70,10 L75,90 L80,50 L160,50 L165,20 L170,80 L175,50 L220,50";
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 50 });
  
  // Animation for the dot to follow the path
  useEffect(() => {
    // Skip animation for minimal variant
    if (variant === 'minimal') return;
    
    // This recreates the effect of the dot following the path
    const animateDot = () => {
      const points = [
        { x: 0, y: 50 },
        { x: 40, y: 50 },
        { x: 45, y: 20 },
        { x: 50, y: 80 },
        { x: 55, y: 50 },
        { x: 65, y: 50 },
        { x: 70, y: 10 },
        { x: 75, y: 90 },
        { x: 80, y: 50 },
        { x: 160, y: 50 },
        { x: 165, y: 20 },
        { x: 170, y: 80 },
        { x: 175, y: 50 },
        { x: 220, y: 50 }
      ];
      
      let currentPoint = 0;
      
      // For loader variant, make animation faster
      const duration = variant === 'loader' ? 1200 : 2500;
      
      const interval = setInterval(() => {
        setDotPosition(points[currentPoint]);
        currentPoint = (currentPoint + 1) % points.length;
      }, duration / points.length);
      
      return () => clearInterval(interval);
    };
    
    const cleanup = animateDot();
    return cleanup;
  }, [variant]);
  
  // Adjust stroke width based on variant
  const getStrokeWidth = () => {
    switch (variant) {
      case 'thin':
        return { main: 1, glow: 2, dot: 2 };
      case 'minimal':
        return { main: 0.75, glow: 0, dot: 0 };
      case 'loader':
        return { main: 1.5, glow: 3, dot: 3 };
      default:
        return { main: 1.5, glow: 3, dot: 3 };
    }
  };
  
  // Adjust opacity based on variant
  const getOpacity = () => {
    switch (variant) {
      case 'thin':
        return { line: 0.6, glow: 0.1 };
      case 'minimal':
        return { line: 0.4, glow: 0 };
      case 'loader':
        return { line: 0.8, glow: 0.15 };
      default:
        return { line: 0.7, glow: 0.15 };
    }
  };
  
  const strokeWidths = getStrokeWidth();
  const opacities = getOpacity();
  
  // For loader variant, use a loop animation
  const pathAnimationProps = variant === 'loader' 
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { 
          pathLength: 1, 
          opacity: opacities.line,
          transition: { 
            pathLength: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.2 }
          }
        }
      }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { 
          pathLength: 1, 
          opacity: opacities.line,
          transition: { 
            pathLength: { duration: 2.5, ease: "easeInOut" },
            opacity: { duration: 0.2 }
          }
        }
      };
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Glow effect container - only for default and loader variants */}
      {(variant === 'default' || variant === 'loader') && (
        <div className="absolute inset-0 blur-[2px] opacity-30">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 220 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d={path}
              stroke={color}
              strokeWidth={strokeWidths.glow}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={opacities.line}
            />
          </svg>
        </div>
      )}
      
      {/* Main lifeline */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 220 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0"
        preserveAspectRatio="none"
      >
        <motion.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidths.main}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...pathAnimationProps}
        />
        
        {/* The pulse dot that follows the line - not for minimal variant */}
        {variant !== 'minimal' && (
          <motion.circle
            cx={dotPosition.x}
            cy={dotPosition.y}
            r={strokeWidths.dot}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: opacities.line,
              transition: { duration: 0.2 }
            }}
          />
        )}
      </svg>
      
      {/* Extra glow layer - only for default variant */}
      {variant === 'default' && (
        <div className="absolute inset-0 blur-[4px] opacity-10">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 220 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d={path}
              stroke={color}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={opacities.glow}
            />
          </svg>
        </div>
      )}
    </div>
  );
} 