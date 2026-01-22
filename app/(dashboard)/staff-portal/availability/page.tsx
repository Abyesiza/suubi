"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/ui/Loader";
import { useState } from "react";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00",
];

export default function StaffAvailabilityPage() {
  const { user } = useUser();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [isRecurring, setIsRecurring] = useState(true);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff profile
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Fetch available times
  const availableTimes = useQuery(
    api.staffProfiles.getStaffAvailableTimes,
    currentUser?._id ? { staffUserId: currentUser._id } : "skip"
  );

  // Mutations
  const addAvailableTime = useMutation(api.staffProfiles.addAvailableTime);
  const removeAvailableTime = useMutation(api.staffProfiles.removeAvailableTime);
  const updateAvailability = useMutation(api.users.updateStaffAvailability);

  // Loading state
  if (currentUser === undefined || staffProfile === undefined || availableTimes === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleAddTimeSlot = async () => {
    if (!currentUser) return;

    try {
      await addAvailableTime({
        staffUserId: currentUser._id,
        dayOfWeek: selectedDay as any,
        startTime,
        endTime,
        isRecurring,
      });
      toast.success("Time slot added successfully");
      setIsAddDialogOpen(false);
      // Reset form
      setSelectedDay("Monday");
      setStartTime("09:00");
      setEndTime("17:00");
      setIsRecurring(true);
    } catch (error) {
      toast.error("Failed to add time slot");
    }
  };

  const handleRemoveTimeSlot = async (timeSlotId: string) => {
    if (!currentUser) return;

    try {
      await removeAvailableTime({
        timeSlotId: timeSlotId as any,
        staffUserId: currentUser._id,
      });
      toast.success("Time slot removed");
    } catch (error) {
      toast.error("Failed to remove time slot");
    }
  };

  const handleToggleAvailability = async () => {
    if (!currentUser) return;

    try {
      await updateAvailability({
        userId: currentUser._id,
        isAvailable: !(staffProfile?.isAvailable || false),
      });
      toast.success(
        staffProfile?.isAvailable
          ? "You are now unavailable for appointments"
          : "You are now available for appointments"
      );
    } catch (error) {
      toast.error("Failed to update availability");
    }
  };

  // Group time slots by day
  const timeSlotsByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = availableTimes?.filter((slot) => slot.dayOfWeek === day) || [];
    return acc;
  }, {} as Record<string, typeof availableTimes>);

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
        title="My Availability"
        description="Manage your working hours and appointment availability"
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-navy hover:bg-brand-navy/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Available Time Slot</DialogTitle>
              <DialogDescription>
                Set your available hours for appointments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="startTime">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger id="endTime">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="recurring">Recurring Weekly</Label>
                  <p className="text-sm text-gray-500">
                    Apply this time slot every week
                  </p>
                </div>
                <Switch
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={setIsRecurring}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTimeSlot} className="bg-brand-teal hover:bg-brand-teal/90">
                Add Time Slot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Availability Status */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  staffProfile?.isAvailable ? "bg-green-100" : "bg-gray-100"
                }`}>
                  {staffProfile?.isAvailable ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Clock className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-brand-navy">
                    {staffProfile?.isAvailable ? "Available for Appointments" : "Unavailable"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {staffProfile?.isAvailable
                      ? "Patients can book appointments with you"
                      : "You are not accepting new appointments"}
                  </p>
                </div>
              </div>
              <Button
                variant={staffProfile?.isAvailable ? "outline" : "default"}
                onClick={handleToggleAvailability}
                className={!staffProfile?.isAvailable ? "bg-brand-eucalyptus hover:bg-brand-eucalyptus/90" : ""}
              >
                {staffProfile?.isAvailable ? "Mark Unavailable" : "Mark Available"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-navy" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Your recurring availability for each day of the week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const daySlots = timeSlotsByDay[day] || [];
              return (
                <div key={day} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-brand-navy mb-2">{day}</h4>
                      {daySlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {daySlots.map((slot) => (
                            <div
                              key={slot._id}
                              className="flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-3 py-1.5 rounded-lg border border-brand-teal/20"
                            >
                              <Clock className="h-3 w-3" />
                              <span className="text-sm font-medium">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <button
                                onClick={() => handleRemoveTimeSlot(slot._id)}
                                className="ml-1 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No availability set</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-brand-teal/20 bg-brand-teal/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-brand-teal flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-brand-navy mb-1">How Availability Works</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Set your recurring weekly schedule for regular appointments</li>
                  <li>Patients can only book during your available time slots</li>
                  <li>Toggle your overall availability status to accept or pause bookings</li>
                  <li>You can add multiple time slots per day</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

