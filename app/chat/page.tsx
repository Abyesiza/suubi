'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  Info, 
  Check, 
  CheckCheck, 
  Image as ImageIcon,
  Paperclip,
  Smile
} from 'lucide-react';
import Lifeline from '@/components/ui/Lifeline';

// Sample doctors data (simplified from doctors page)
const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500',
    specialty: 'Cardiologist',
    online: true,
    lastSeen: 'Online',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500',
    specialty: 'Pediatrician',
    online: false,
    lastSeen: '10 min ago',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=500',
    specialty: 'Neurologist',
    online: true,
    lastSeen: 'Online',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    image: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=500',
    specialty: 'Dermatologist',
    online: false,
    lastSeen: '1 hour ago',
  },
  {
    id: 5,
    name: 'Dr. Olivia Taylor',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=500',
    specialty: 'Orthopedic Surgeon',
    online: false,
    lastSeen: '30 min ago',
  },
  {
    id: 6,
    name: 'Dr. Robert Kim',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=500',
    specialty: 'Psychiatrist',
    online: true,
    lastSeen: 'Online',
  },
];

// Sample chat data
const initialChats = {
  1: [
    {
      id: 1,
      sender: 'doctor',
      text: 'Hello! How can I help you today?',
      time: '9:30 AM',
      status: 'read',
    },
    {
      id: 2,
      sender: 'patient',
      text: 'Good morning Dr. Johnson. I\'ve been experiencing chest pain recently, especially after physical activity.',
      time: '9:32 AM',
      status: 'read',
    },
    {
      id: 3,
      sender: 'doctor',
      text: 'I understand your concern. Could you describe the pain more specifically? Is it sharp, dull, or pressure-like? And does it radiate to other areas?',
      time: '9:35 AM',
      status: 'read',
    },
    {
      id: 4,
      sender: 'patient',
      text: 'It\'s more of a pressure feeling in the center of my chest. Sometimes it extends to my left arm.',
      time: '9:38 AM',
      status: 'read',
    },
    {
      id: 5,
      sender: 'doctor',
      text: 'Thank you for the details. Given your symptoms, I recommend scheduling an in-person appointment for a proper evaluation. This would include an ECG and possibly other tests. Are you available this week?',
      time: '9:42 AM',
      status: 'read',
    },
    {
      id: 6,
      sender: 'patient',
      text: 'Yes, I can come in this week. What days are you available?',
      time: '9:45 AM',
      status: 'read',
    },
    {
      id: 7,
      sender: 'doctor',
      text: 'I have openings on Wednesday and Friday morning. In the meantime, if the pain becomes severe or is accompanied by shortness of breath, sweating, or nausea, please go to the emergency room immediately.',
      time: '9:48 AM',
      status: 'read',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'doctor',
      text: 'Hello! I saw your appointment request about the recurring headaches. How are you feeling today?',
      time: '2:15 PM',
      status: 'read',
    },
    {
      id: 2,
      sender: 'patient',
      text: 'Hi Dr. Rodriguez. The headaches are still happening, about 3-4 times per week now.',
      time: '2:20 PM',
      status: 'read',
    },
    {
      id: 3,
      sender: 'doctor',
      text: "I'd like to discuss some potential triggers. Have you noticed any patterns with food, stress, or sleep?",
      time: '2:22 PM',
      status: 'read',
    },
  ],
  6: [
    {
      id: 1,
      sender: 'patient',
      text: 'Dr. Kim, I wanted to update you on how the new anxiety management techniques are working.',
      time: 'Yesterday',
      status: 'read',
    },
    {
      id: 2,
      sender: 'doctor',
      text: "I'm glad you reached out. How are the breathing exercises and journaling working for you?",
      time: 'Yesterday',
      status: 'read',
    },
  ]
};

export default function ChatPage() {
  // Check for doctor ID in URL parameters
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [messages, setMessages] = useState(initialChats[1] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get doctor ID from URL on initial load
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const doctorId = searchParams.get('doctor');
      
      if (doctorId) {
        const doctorIdNum = parseInt(doctorId, 10);
        setSelectedDoctorId(doctorIdNum);
        
        // Find doctor by ID
        const doctor = doctors.find(d => d.id === doctorIdNum);
        if (doctor) {
          setSelectedDoctor(doctor);
          setMessages(initialChats[doctorIdNum as keyof typeof initialChats] || []);
        }
      }
    }
  }, []);
  
  // Filter doctors based on search
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Change selected doctor and load appropriate chat
  const handleDoctorSelect = (doctor: typeof doctors[number]) => {
    setSelectedDoctor(doctor);
    setMessages(initialChats[doctor.id as keyof typeof initialChats] || []);
  };
  
  // Send a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'patient',
      text: newMessage,
      time: 'Just now',
      status: 'sent',
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * 3);
      const responses = [
        "Thank you for sharing that information. I'll review it and get back to you soon.",
        "I understand your concern. Let's schedule a follow-up appointment to discuss this further.",
        "That's helpful to know. Please continue monitoring your symptoms and keep me updated on any changes."
      ];
      
      const doctorResponse = {
        id: messages.length + 2,
        sender: 'doctor',
        text: responses[responseIndex],
        time: 'Just now',
        status: 'sent',
      };
      
      setMessages(prev => [...prev, doctorResponse]);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen pt-8 pb-12 bg-background">
      <div className="container-custom h-[calc(100vh-180px)] max-h-[900px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2 text-dark-purple">Doctor Chat</h1>
          <p className="text-dark-purple/80">
            Securely message your healthcare providers and receive medical guidance.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full overflow-hidden">
          {/* Left Sidebar - Doctor List */}
          <Card className="p-4 border-[#73A580]/30 md:col-span-1 h-full overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-dark-purple/50" />
              <Input
                placeholder="Search doctors..."
                className="pl-10 w-full border-[#73A580]/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="overflow-y-auto flex-1 pr-1 space-y-1">
              {filteredDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  whileHover={{ x: 4 }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDoctor.id === doctor.id 
                      ? 'bg-[#73A580]/20' 
                      : 'hover:bg-[#73A580]/10'
                  }`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-[#73A580]/30">
                        <img src={doctor.image} alt={doctor.name} className="object-cover" />
                      </Avatar>
                      {doctor.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-dark-purple truncate">{doctor.name}</h3>
                        {initialChats[doctor.id as keyof typeof initialChats] && (
                          <span className="text-xs text-dark-purple/50">
                            {initialChats[doctor.id as keyof typeof initialChats][initialChats[doctor.id as keyof typeof initialChats].length - 1].time}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-dark-purple/60 truncate">{doctor.specialty}</p>
                        {doctor.online ? (
                          <span className="text-xs text-green-600">Online</span>
                        ) : (
                          <span className="text-xs text-dark-purple/50">{doctor.lastSeen}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
          
          {/* Right Side - Chat Area */}
          <Card className="border-[#73A580]/30 md:col-span-3 flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#73A580]/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-[#73A580]/30">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="object-cover" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-dark-purple">{selectedDoctor.name}</h3>
                  <p className="text-xs text-dark-purple/60">
                    {selectedDoctor.online ? (
                      <span className="text-green-600">Online</span>
                    ) : (
                      selectedDoctor.lastSeen
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAF9]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'doctor' && (
                    <Avatar className="h-8 w-8 mr-2 self-end mb-2 border border-[#73A580]/30">
                      <img src={selectedDoctor.image} alt={selectedDoctor.name} className="object-cover" />
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] ${message.sender === 'patient' ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`rounded-xl p-3 inline-block ${
                        message.sender === 'patient'
                          ? 'bg-[#E1AD01]/90 text-dark-purple rounded-tr-none'
                          : 'bg-[#73A580]/20 text-dark-purple rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <div className={`flex items-center mt-1 text-xs ${
                      message.sender === 'patient' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-dark-purple/60 mr-1">{message.time}</span>
                      {message.sender === 'patient' && (
                        message.status === 'read' ? (
                          <CheckCheck className="h-3 w-3 text-dark-purple/60" />
                        ) : (
                          <Check className="h-3 w-3 text-dark-purple/60" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-3 border-t border-[#73A580]/30 bg-white">
              <div className="flex gap-2 items-center">
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-dark-purple/70 hover:text-dark-purple">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  className="flex-1 border-[#73A580]/30"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="bg-[#E1AD01] hover:bg-[#73A580] text-dark-purple hover:text-white"
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === ''}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 px-2">
                <p className="text-xs text-dark-purple/50 text-center">
                  All messages are encrypted and compliant with healthcare privacy regulations
                </p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Important Notice */}
        <div className="mt-6 bg-[#73A580]/20 rounded-xl p-4 text-sm text-dark-purple/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1">
            <Lifeline color="#E1AD01" height="6px" variant="thin" className="opacity-60" />
          </div>
          <p className="font-medium">Important: Chat services are for non-urgent communication only</p>
          <p>For medical emergencies, please call emergency services (911) or go to your nearest emergency room.</p>
        </div>
      </div>
    </div>
  );
}
