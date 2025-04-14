'use client';

import { ReactNode } from 'react';
import Lifeline from '@/components/ui/Lifeline';

interface PageLayoutProps {
  children: ReactNode;
  showLifelines?: boolean;
}

export default function PageLayout({ children, showLifelines = true }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen pt-20">
      {showLifelines && (
        <>
          {/* Top horizontal lifeline */}
          <div className="absolute top-16 left-0 right-0 w-full z-10">
            <Lifeline 
              color="#FF9933" 
              height="30px" 
              variant="thin"
              className="opacity-60"
            />
          </div>
          
          {/* Bottom horizontal lifeline */}
          <div className="absolute bottom-0 left-0 right-0 w-full z-10">
            <Lifeline 
              color="#FF9933" 
              height="30px" 
              variant="thin"
              className="opacity-60 transform rotate-180"
            />
          </div>
        </>
      )}

      {/* Page content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
} 