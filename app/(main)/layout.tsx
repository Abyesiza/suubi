import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import ChatBubble from '@/components/ChatBubble';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow animate-fade-in pt-0">
        {children}
      </main>

      <Footer />

      <ChatBubble />
    </div>
  )
}
