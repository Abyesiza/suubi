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
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';


export default function ChatPage() {
  const { user: clerkUser } = useUser();
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"rooms"> | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [staffProfileId, setStaffProfileId] = useState<Id<"staff_profiles"> | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user from Convex
  const currentUser = useQuery(
    api.users.getCurrentUser,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  // Get user's chat rooms
  const userRooms = useQuery(
    api.room.listRoomsForUser,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  // Get messages for selected room
  const messagesData = useQuery(
    api.messages.listMessages,
    selectedRoomId ? { roomId: selectedRoomId, limit: 50 } : "skip"
  );

  // Get typing users for selected room
  const typingUsers = useQuery(
    api.typing.getTypingUsers,
    selectedRoomId && currentUser ? { 
      roomId: selectedRoomId, 
      excludeUserId: currentUser._id 
    } : "skip"
  );

  // Mutations
  const createRoomWithStaffProfile = useMutation(api.room.createOrGetRoomWithStaffProfile);
  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const markAllAsRead = useMutation(api.messages.markAllMessagesAsRead);
  const setTypingStatus = useMutation(api.typing.setTypingStatus);

  // Handle staffProfileId from URL and create/get room
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const profileId = searchParams.get('staffProfileId');
      
      if (profileId && currentUser) {
        setStaffProfileId(profileId as Id<"staff_profiles">);
        
        // Create or get room with this staff profile
        createRoomWithStaffProfile({
          patientUserId: currentUser._id,
          staffProfileId: profileId as Id<"staff_profiles">,
        }).then((roomId) => {
          setSelectedRoomId(roomId);
        }).catch((error) => {
          console.error("Failed to create/get room:", error);
        });
      }
    }
  }, [currentUser, createRoomWithStaffProfile]);
  
  // Filter rooms based on search
  const filteredRooms = (userRooms || []).filter(roomData => {
    const otherUser = roomData.otherUser;
    const staffProfile = roomData.staffProfile;
    const name = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim();
    const specialty = staffProfile?.specialty || '';
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           specialty.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get current messages
  const messages = messagesData?.messages || [];
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when room is selected
  useEffect(() => {
    if (selectedRoomId && currentUser) {
      markAllAsRead({
        roomId: selectedRoomId,
        userId: currentUser._id,
      }).catch((error) => {
        console.error("Failed to mark messages as read:", error);
      });
    }
  }, [selectedRoomId, currentUser, markAllAsRead]);
  
  // Handle room selection
  const handleRoomSelect = (roomData: typeof filteredRooms[number]) => {
    setSelectedRoomId(roomData.room._id);
  };

  // Handle typing indicators
  const handleTypingStart = () => {
    if (!selectedRoomId || !currentUser || isTyping) return;
    
    setIsTyping(true);
    setTypingStatus({
      roomId: selectedRoomId,
      userId: currentUser._id,
      isTyping: true,
    }).catch((error) => {
      console.error("Failed to set typing status:", error);
    });
  };

  const handleTypingStop = () => {
    if (!selectedRoomId || !currentUser || !isTyping) return;
    
    setIsTyping(false);
    setTypingStatus({
      roomId: selectedRoomId,
      userId: currentUser._id,
      isTyping: false,
    }).catch((error) => {
      console.error("Failed to clear typing status:", error);
    });
  };

  // Handle input change with typing indicators
  const handleInputChange = (value: string) => {
    setNewMessage(value);
    
    if (value.trim() && !isTyping) {
      handleTypingStart();
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };
  
  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoomId || !currentUser) return;
    
    try {
      // Stop typing
      handleTypingStop();
      
      // Send message
      await sendMessageMutation({
        roomId: selectedRoomId,
        senderId: currentUser._id,
        content: newMessage.trim(),
        messageType: "text",
      });
      
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Get selected room data
  const selectedRoom = userRooms?.find(room => room.room._id === selectedRoomId);
  const otherUser = selectedRoom?.otherUser;
  const staffProfile = selectedRoom?.staffProfile;
  
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
              {filteredRooms.map((roomData) => {
                const name = roomData.otherUser 
                  ? `${roomData.otherUser.firstName || ''} ${roomData.otherUser.lastName || ''}`.trim()
                  : 'Unknown User';
                const specialty = roomData.staffProfile?.specialty || 'Patient';
                const isOnline = roomData.staffProfile?.isAvailable || false;
                const profileImage = roomData.staffProfile?.profileImage || roomData.otherUser?.imageUrl;
                
                return (
                  <motion.div
                    key={roomData.room._id}
                    whileHover={{ x: 4 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRoomId === roomData.room._id 
                        ? 'bg-[#73A580]/20' 
                        : 'hover:bg-[#73A580]/10'
                    }`}
                    onClick={() => handleRoomSelect(roomData)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-[#73A580]/30">
                          <img 
                            src={profileImage || 'https://via.placeholder.com/40?text=U'} 
                            alt={name} 
                            className="object-cover" 
                          />
                        </Avatar>
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                        {roomData.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {roomData.unreadCount > 9 ? '9+' : roomData.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-dark-purple truncate">{name}</h3>
                          {roomData.lastMessage && (
                            <span className="text-xs text-dark-purple/50">
                              {new Date(roomData.lastMessage.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-dark-purple/60 truncate">{specialty}</p>
                          {isOnline ? (
                            <span className="text-xs text-green-600">Available</span>
                          ) : (
                            <span className="text-xs text-dark-purple/50">Offline</span>
                          )}
                        </div>
                        {roomData.lastMessage && (
                          <p className="text-xs text-dark-purple/50 truncate mt-1">
                            {roomData.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filteredRooms.length === 0 && (
                <div className="text-center py-8 text-dark-purple/60">
                  <p>No conversations yet</p>
                  <p className="text-xs mt-1">Start a conversation with a doctor</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Right Side - Chat Area */}
          <Card className="border-[#73A580]/30 md:col-span-3 flex flex-col h-full overflow-hidden">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#73A580]/30 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-[#73A580]/30">
                      <img 
                        src={staffProfile?.profileImage || otherUser?.imageUrl || 'https://via.placeholder.com/40?text=U'} 
                        alt={`${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim()} 
                        className="object-cover" 
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-dark-purple">
                        {otherUser ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() : 'Unknown User'}
                      </h3>
                      <p className="text-xs text-dark-purple/60">
                        {staffProfile?.isAvailable ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span>Offline</span>
                        )}
                        {staffProfile?.specialty && (
                          <span className="ml-2">• {staffProfile.specialty}</span>
                        )}
                      </p>
                      {/* Typing indicator */}
                      {typingUsers && typingUsers.length > 0 && (
                        <p className="text-xs text-green-600 italic">
                          {typingUsers.length === 1 
                            ? `${typingUsers[0].user.firstName || 'Someone'} is typing...`
                            : `${typingUsers.length} people are typing...`
                          }
                        </p>
                      )}
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
                  {messages.length === 0 ? (
                    <div className="text-center py-20 text-dark-purple/60">
                      <p>No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    messages.slice().reverse().map((message) => {
                      const isCurrentUser = message.senderId === currentUser?._id;
                      const isRead = message.readBy && message.readBy.length > 0;
                      
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 mr-2 self-end mb-2 border border-[#73A580]/30">
                              <img 
                                src={message.sender.imageUrl || 'https://via.placeholder.com/32?text=U'} 
                                alt={`${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()} 
                                className="object-cover" 
                              />
                            </Avatar>
                          )}
                          <div className={`max-w-[75%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
                            <div
                              className={`rounded-xl p-3 inline-block ${
                                isCurrentUser
                                  ? 'bg-[#E1AD01]/90 text-dark-purple rounded-tr-none'
                                  : 'bg-[#73A580]/20 text-dark-purple rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className={`flex items-center mt-1 text-xs ${
                              isCurrentUser ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-dark-purple/60 mr-1">
                                {new Date(message.createdAt).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              {isCurrentUser && (
                                isRead ? (
                                  <CheckCheck className="h-3 w-3 text-blue-600" />
                                ) : (
                                  <Check className="h-3 w-3 text-dark-purple/60" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
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
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={!currentUser}
                    />
                    <Button
                      className="bg-[#E1AD01] hover:bg-[#73A580] text-dark-purple hover:text-white"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !currentUser}
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
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-dark-purple/60">
                <div className="text-center">
                  <p className="text-lg mb-2">Select a conversation</p>
                  <p className="text-sm">Choose a doctor or patient to start messaging</p>
                </div>
              </div>
            )}
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
