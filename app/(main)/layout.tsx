import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatBubble from '@/components/ChatBubble'
import Lifeline from '@/components/ui/Lifeline'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen pt-0">

      <Navbar />

      <div className="relative z-20">{children}</div>

      <Footer />

      <div className="absolute bottom-0 left-0 right-0 w-full z-10">
        <Lifeline color="#FF9933" height="30px" variant="thin" className="opacity-60 transform rotate-180" />
      </div>

      <ChatBubble />
    </div>
  )
}
