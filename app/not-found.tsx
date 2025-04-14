'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Lifeline from '@/components/ui/Lifeline';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-3xl p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-8xl font-bold mb-6 text-foreground">404</h1>
          
          {/* Flatline effect for 404 error */}
          <div className="w-full h-16 mb-8 relative">
            <Lifeline 
              color="#FF9933" 
              height="40px" 
              variant="minimal"
              className="opacity-70"
            />
            
            {/* Overlay a flatlining effect on hover */}
            <div className="absolute inset-0 hover:opacity-100 opacity-0 transition-opacity duration-500">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0,50 L80,50 L90,50 L100,15 L110,85 L120,50 L130,50 L140,50 L150,50 L160,50 L170,50 L180,50 L300,50"
                  stroke="#FF9933"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-semibold mb-4 text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on the path to better health.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button className="btn-primary">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            <Button variant="outline" className="border-primary text-primary" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-16 p-6 bg-[hsl(var(--suubi-green-50))] rounded-xl max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Need help finding something?</h3>
            <p className="text-muted-foreground mb-4">
              If you're looking for specific healthcare services or resources, 
              our support team is ready to assist you.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 