import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBubble from '@/components/ChatBubble';
import Lifeline from '@/components/ui/Lifeline';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Suubi Healthcare - Your Wellness Partner',
  description: 'Modern healthcare solutions for your well-being',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <body className={inter.className}>
        <div className="relative min-h-screen pt-20">
          {/* Top horizontal lifeline */}
          <div className="absolute top-16 left-0 right-0 w-full z-10">
            <Lifeline 
              color="#FF9933" 
              height="30px" 
              variant="thin"
              className="opacity-60"
            />
          </div>
          
          <Navbar />
          
          {/* Page content */}
          <div className="relative z-20">
            {children}
          </div>
          
          <Footer />
          
          {/* Bottom horizontal lifeline */}
          <div className="absolute bottom-0 left-0 right-0 w-full z-10">
            <Lifeline 
              color="#FF9933" 
              height="30px" 
              variant="thin"
              className="opacity-60 transform rotate-180"
            />
          </div>
          
          <ChatBubble />
          <Toaster />
        </div>
      </body>
    </html>
  );
}