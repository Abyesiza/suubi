"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Stethoscope,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/ui/Loader";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PatientMessagesPage() {
  const { user } = useUser();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Fetch all rooms for the user
  const rooms = useQuery(
    api.room.listRoomsForUser,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Fetch messages for selected room
  const messagesData = useQuery(
    api.messages.listMessages,
    selectedRoomId ? { roomId: selectedRoomId as any, limit: 100 } : "skip"
  );

  // Mutations
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAllAsRead = useMutation(api.messages.markAllMessagesAsRead);

  // Loading state
  if (currentUser === undefined || rooms === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Auto-select first room if none selected
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].room._id);
    }
  }, [rooms, selectedRoomId]);

  // Mark messages as read when room is selected
  useEffect(() => {
    if (selectedRoomId && currentUser) {
      markAllAsRead({
        roomId: selectedRoomId as any,
        userId: currentUser._id,
      });
    }
  }, [selectedRoomId, currentUser, markAllAsRead]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData?.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedRoomId || !currentUser) return;

    try {
      await sendMessage({
        roomId: selectedRoomId as any,
        senderId: currentUser._id,
        content: messageInput.trim(),
      });
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter rooms based on search
  const filteredRooms = rooms?.filter((room) => {
    if (!searchQuery) return true;
    const otherUser = room.otherUser;
    const fullName = `${otherUser?.firstName || ""} ${otherUser?.lastName || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const selectedRoom = rooms?.find((r) => r.room._id === selectedRoomId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      <PageHeader
        title="Messages"
        description="Chat with your healthcare providers"
      />

      <motion.div variants={itemVariants}>
        <Card className="shadow-md border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-240px)] min-h-[500px]">
            {/* Conversations List - Sidebar */}
            <div className={cn(
              "w-full sm:w-80 border-r border-gray-200 flex flex-col bg-gray-50",
              selectedRoomId && "hidden sm:flex"
            )}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                {filteredRooms && filteredRooms.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredRooms.map((room) => {
                      const otherUser = room.otherUser;
                      const isSelected = room.room._id === selectedRoomId;
                      const hasUnread = room.unreadCount > 0;

                      return (
                        <button
                          key={room.room._id}
                          onClick={() => setSelectedRoomId(room.room._id)}
                          className={cn(
                            "w-full p-4 text-left transition-colors hover:bg-white",
                            isSelected && "bg-white border-l-4 border-brand-teal"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage
                                  src={room.staffProfile?.profileImage || otherUser?.imageUrl}
                                  alt={otherUser?.firstName || "User"}
                                />
                                <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                                  {room.staffProfile ? (
                                    <Stethoscope className="h-5 w-5" />
                                  ) : (
                                    (otherUser?.firstName?.[0] || "") + (otherUser?.lastName?.[0] || "")
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              {hasUnread && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold">
                                    {room.unreadCount}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={cn(
                                  "font-semibold text-sm truncate",
                                  hasUnread ? "text-brand-navy" : "text-gray-700"
                                )}>
                                  {room.staffProfile ? "Dr. " : ""}
                                  {otherUser?.firstName} {otherUser?.lastName}
                                </h3>
                                {room.lastMessage && (
                                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                    {formatDistanceToNow(new Date(room.lastMessage.createdAt), {
                                      addSuffix: true,
                                    }).replace("about ", "")}
                                  </span>
                                )}
                              </div>
                              {room.staffProfile?.specialty && (
                                <p className="text-xs text-gray-500 capitalize mb-1">
                                  {room.staffProfile.specialty}
                                </p>
                              )}
                              {room.lastMessage && (
                                <p className={cn(
                                  "text-sm truncate",
                                  hasUnread ? "font-medium text-brand-navy" : "text-gray-500"
                                )}>
                                  {room.lastMessage.senderId === currentUser?._id && "You: "}
                                  {room.lastMessage.content}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-sm text-gray-500">
                      Start a conversation with your doctor after booking an appointment
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            {selectedRoom ? (
              <div className={cn(
                "flex-1 flex flex-col bg-white",
                "w-full sm:w-auto"
              )}>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:hidden"
                      onClick={() => setSelectedRoomId(null)}
                    >
                      ←
                    </Button>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={selectedRoom.staffProfile?.profileImage || selectedRoom.otherUser?.imageUrl}
                        alt={selectedRoom.otherUser?.firstName || "User"}
                      />
                      <AvatarFallback className="bg-brand-teal/10 text-brand-teal">
                        {selectedRoom.staffProfile ? (
                          <Stethoscope className="h-5 w-5" />
                        ) : (
                          (selectedRoom.otherUser?.firstName?.[0] || "") +
                          (selectedRoom.otherUser?.lastName?.[0] || "")
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-brand-navy truncate">
                        {selectedRoom.staffProfile ? "Dr. " : ""}
                        {selectedRoom.otherUser?.firstName} {selectedRoom.otherUser?.lastName}
                      </h3>
                      {selectedRoom.staffProfile?.specialty && (
                        <p className="text-sm text-gray-500 capitalize truncate">
                          {selectedRoom.staffProfile.specialty}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {messagesData?.messages && messagesData.messages.length > 0 ? (
                    <div className="space-y-4">
                      {[...messagesData.messages].reverse().map((message) => {
                        const isOwn = message.senderId === currentUser?._id;
                        return (
                          <div
                            key={message._id}
                            className={cn(
                              "flex gap-2",
                              isOwn ? "justify-end" : "justify-start"
                            )}
                          >
                            {!isOwn && (
                              <Avatar className="h-8 w-8 border border-gray-200 flex-shrink-0">
                                <AvatarImage src={message.sender.imageUrl} />
                                <AvatarFallback className="bg-brand-teal/10 text-brand-teal text-xs">
                                  {(message.sender.firstName?.[0] || "") +
                                    (message.sender.lastName?.[0] || "")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2",
                                isOwn
                                  ? "bg-brand-teal text-white rounded-br-sm"
                                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
                              )}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                              <p
                                className={cn(
                                  "text-xs mt-1",
                                  isOwn ? "text-white/70" : "text-gray-500"
                                )}
                              >
                                {format(new Date(message.createdAt), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No messages yet
                      </h3>
                      <p className="text-sm text-gray-500">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-brand-teal hover:bg-brand-teal/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

