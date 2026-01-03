'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import {
  Search,
  Send,
  Check,
  CheckCheck,
  MessageSquare,
  MoreVertical,
  Phone,
  Video,
  Info,
  ChevronLeft
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatPage() {
  const { user: clerkUser } = useUser();
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"rooms"> | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [staffProfileId, setStaffProfileId] = useState<Id<"staff_profiles"> | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);

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
          setShowMobileSidebar(false);
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
    setShowMobileSidebar(false);
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
      handleTypingStop();
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

  const isCurrentUser = (message: any) => message.senderId === currentUser?._id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Blue Hero Section */}
      <div className="bg-brand-navy pt-24 pb-32 px-4 md:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white mb-4 backdrop-blur-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
              Real-Time Care
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white font-heading">
              Talk to Our Team
            </h1>
            <p className="text-white/80 max-w-2xl text-base md:text-lg leading-relaxed">
              Securely message your healthcare providers and receive medical guidance from the comfort of your home.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Chat Interface - Overlapping the hero */}
      <div className="container-custom flex-1 -mt-20 mb-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-brand-xl border border-gray-100 h-[calc(100vh-280px)] min-h-[600px] overflow-hidden flex shadow-2xl">
          {/* Left Sidebar - Doctor List */}
          <div className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 absolute md:relative z-30 w-full md:w-80 lg:w-96 h-full bg-white border-r border-gray-100 flex flex-col`}>
            <div className="p-4 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Chat with doctors will appear here</p>
                </div>
              ) : (
                filteredRooms.map((roomData) => {
                  const name = roomData.otherUser
                    ? `${roomData.otherUser.firstName || ''} ${roomData.otherUser.lastName || ''}`.trim()
                    : 'Unknown User';
                  const specialty = roomData.staffProfile?.specialty || 'Patient';
                  const isOnline = roomData.staffProfile?.isAvailable || false;
                  const profileImage = roomData.staffProfile?.profileImage || roomData.otherUser?.imageUrl;
                  const isSelected = selectedRoomId === roomData.room._id;

                  return (
                    <motion.div
                      key={roomData.room._id}
                      whileHover={{ scale: 0.99 }}
                      onClick={() => handleRoomSelect(roomData)}
                      className={cn(
                        "p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                        isSelected
                          ? "bg-brand-navy/5 border-brand-navy/10 shadow-sm"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className={cn(
                            "h-12 w-12 border-2",
                            isSelected ? "border-brand-navy/20" : "border-gray-100"
                          )}>
                            <img
                              src={profileImage || 'https://via.placeholder.com/48?text=U'}
                              alt={name}
                              className="object-cover"
                            />
                          </Avatar>
                          {isOnline && (
                            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm"></span>
                          )}
                          {roomData.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                              {roomData.unreadCount > 9 ? '9+' : roomData.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className={cn(
                              "font-semibold text-sm truncate",
                              isSelected ? "text-brand-navy" : "text-gray-900"
                            )}>{name}</h3>
                            {roomData.lastMessage && (
                              <span className="text-[10px] text-gray-400 font-medium">
                                {new Date(roomData.lastMessage.createdAt).toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs mb-1">
                            <span className="text-gray-500 truncate max-w-[120px]">{specialty}</span>
                            {isOnline && (
                              <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-medium border border-green-100">
                                Online
                              </span>
                            )}
                          </div>
                          {roomData.lastMessage && (
                            <p className={cn(
                              "text-xs truncate",
                              roomData.unreadCount > 0 ? "font-medium text-gray-900" : "text-gray-400"
                            )}>
                              <span className="inline-block mr-1">{isCurrentUser(roomData.lastMessage) ? 'You:' : ''}</span>
                              {roomData.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile Overlay */}
          {showMobileSidebar && (
            <div
              className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}

          {/* Right Side - Chat Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50 relative w-full">
            {selectedRoomId ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-4 md:px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-sm z-10 w-full">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden -ml-2 text-gray-500"
                      onClick={() => setShowMobileSidebar(true)}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>

                    <Avatar className="h-10 w-10 border border-gray-100 hidden md:block">
                      <img
                        src={staffProfile?.profileImage || otherUser?.imageUrl || 'https://via.placeholder.com/40?text=U'}
                        alt="User"
                        className="object-cover"
                      />
                    </Avatar>

                    <div>
                      <h3 className="font-bold text-brand-navy text-sm md:text-base flex items-center gap-2">
                        {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown User'}
                        {staffProfile?.verified && (
                          <CheckCheck className="w-3.5 h-3.5 text-brand-teal" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        {staffProfile?.isAvailable ? (
                          <span className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="text-gray-400">Offline</span>
                        )}
                        {typingUsers && typingUsers.length > 0 && (
                          <span className="text-brand-orange animate-pulse font-medium">
                            Typing...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-brand-navy hover:bg-brand-navy/5">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-brand-navy hover:bg-brand-navy/5">
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-brand-navy hover:bg-brand-navy/5">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-in fade-in duration-700">
                      <div className="w-24 h-24 bg-brand-navy/5 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare className="w-10 h-10 text-brand-navy/20" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-navy mb-2">Start a conversation</h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        Sending health information? Don't worry, your messages are encrypted and secure.
                      </p>
                    </div>
                  ) : (
                    messages.slice().reverse().map((message, index) => {
                      const isCurrentUser = message.senderId === currentUser?._id;
                      const isRead = message.readBy && message.readBy.length > 0;
                      const showAvatar = !isCurrentUser && (index === 0 || messages.slice().reverse()[index - 1]?.senderId === currentUser?._id);

                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "flex gap-3 max-w-[85%] md:max-w-[70%]",
                            isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
                          )}
                        >
                          {!isCurrentUser && (
                            <div className="w-8 shrink-0 flex flex-col justify-end">
                              {showAvatar ? (
                                <Avatar className="h-8 w-8 border border-white shadow-sm">
                                  <img src={message.sender.imageUrl || ''} alt="" className="object-cover" />
                                </Avatar>
                              ) : <div className="w-8" />}
                            </div>
                          )}

                          <div className={cn(
                            "group relative px-4 py-3 shadow-sm text-sm",
                            isCurrentUser
                              ? "bg-brand-navy text-white rounded-2xl rounded-tr-none"
                              : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
                          )}>
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <div className={cn(
                              "flex items-center gap-1 mt-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity",
                              isCurrentUser ? "text-white/60 justify-end" : "text-gray-400"
                            )}>
                              {format(message.createdAt, 'h:mm a')}
                              {isCurrentUser && (
                                isRead ? <CheckCheck className="w-3 h-3 text-brand-teal" /> : <Check className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10">
                  <div className="max-w-4xl mx-auto flex items-end gap-3 p-2 bg-gray-50 rounded-3xl border border-gray-200 focus-within:ring-2 focus-within:ring-brand-teal/20 focus-within:border-brand-teal/50 transition-all">
                    <Button size="icon" variant="ghost" className="rounded-full text-gray-400 hover:text-brand-navy hover:bg-brand-navy/5 shrink-0">
                      <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                        <span className="w-0.5 h-2.5 bg-current rounded-full" />
                        <span className="w-2.5 h-0.5 bg-current rounded-full absolute" />
                      </div>
                    </Button>

                    <textarea
                      value={newMessage}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 bg-transparent border-none focus:ring-0 p-3 min-h-[44px] max-h-32 resize-none text-sm text-gray-800 placeholder:text-gray-400 scrollbar-hide"
                      rows={1}
                    />

                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={cn(
                        "rounded-full w-10 h-10 shrink-0 transition-all duration-300 shadow-md",
                        newMessage.trim()
                          ? "bg-brand-navy hover:bg-brand-navy-light text-white rotate-0 scale-100"
                          : "bg-gray-200 text-gray-400 rotate-90 scale-90 opacity-70 cursor-not-allowed"
                      )}
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                    <Info className="w-3 h-3" />
                    medical advice provided here is for information purposes only
                  </p>
                </div>
              </>
            ) : (
              /* Empty State - No Room Selected */
              <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] p-8 text-center">
                <div className="w-32 h-32 bg-white rounded-full shadow-brand-xl flex items-center justify-center mb-8 animate-pulse-subtle">
                  <div className="w-24 h-24 bg-brand-navy/5 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-12 h-12 text-brand-navy" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-brand-navy mb-4 font-heading">Suubi Secure Chat</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                  Select a doctor from the sidebar to start a secure, encrypted consultation.
                </p>
                <div className="flex gap-4 text-sm text-gray-400 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-brand-teal" />
                    <span>End-to-End Encrypted</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-brand-teal" />
                    <span>HIPAA Compliant</span>
                  </div>
                </div>
                <Button
                  className="mt-8 md:hidden bg-brand-navy text-white rounded-full px-8 shadow-lg shadow-brand-navy/20"
                  onClick={() => setShowMobileSidebar(true)}
                >
                  View Conversations
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
