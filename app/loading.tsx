'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/ui/Loader';

// Health facts to display during loading
const healthFacts = [
  "Drinking water can help you maintain your energy levels throughout the day.",
  "Regular exercise can improve your mood and reduce feelings of anxiety and depression.",
  "Adults need 7-9 hours of sleep per night for optimal health.",
  "Eating a balanced diet rich in fruits and vegetables boosts your immune system.",
  "Taking short breaks during work can improve your productivity and focus.",
  "Deep breathing exercises can help reduce stress and improve mental clarity.",
  "Regular health check-ups can help detect potential issues early.",
  "Maintaining good posture helps prevent back and neck pain.",
  "Staying socially connected is linked to better mental and physical health.",
  "Laughter actually strengthens your immune system and boosts mood.",
];

export default function Loading() {
  const [factIndex, setFactIndex] = useState(0);
  
  // Change facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % healthFacts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <Loader size="lg" />
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl font-semibold mb-4 text-foreground">
            Preparing Your Health Journey
          </h1>
          <p className="text-muted-foreground">
            We're setting up your personalized healthcare experience...
          </p>
        </motion.div>
        
        <div className="h-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-[hsl(var(--suubi-green-50))] p-4 rounded-lg text-center shadow-md"
            >
              <h3 className="text-sm font-medium text-primary mb-2">Did you know?</h3>
              <p className="text-foreground">{healthFacts[factIndex]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="mt-12">
          <div className="w-full bg-background-muted rounded-full h-1 mb-3">
            <motion.div
              className="bg-primary h-1 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: "100%",
                transition: { duration: 5, repeat: Infinity }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This won't take long...
          </p>
        </div>
      </div>
    </div>
  );
} 