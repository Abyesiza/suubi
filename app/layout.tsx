import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import ConvexClientProvider from '@/providers/convexProviderWithClerk';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Suubi Centre — Healthcare, Education, and Hope',
  description: 'Community-powered primary care, health education, and vocational training in Uganda.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="font-sans">
        <body>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}