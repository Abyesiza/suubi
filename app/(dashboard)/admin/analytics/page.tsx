"use client";

import { useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { BarChart3, Calendar, MessageSquare, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";

export default function AdminAnalyticsPage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });

  const { startDate, endDate } = useMemo(() => {
    const end = Date.now();
    const start = end - 30 * 24 * 60 * 60 * 1000;
    return { startDate: start, endDate: end };
  }, []);

  const appointmentStats = useQuery(
    api.appointments.getAppointmentStatsForAdmin,
    currentUser?._id ? { adminUserId: currentUser._id, startDate, endDate } : "skip",
  );

  const messageStats = useQuery(
    api.messages.getMessageStatsForAdmin,
    currentUser?._id ? { adminUserId: currentUser._id, startDate, endDate } : "skip",
  );

  if (currentUser === undefined || appointmentStats === undefined || messageStats === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Analytics"
        description="30-day overview of appointments and messaging activity"
      />

      <div className="grid gap-3 grid-cols-2 md:gap-4 lg:grid-cols-4">
        <StatsCard
          title="Total Appointments"
          value={appointmentStats.total}
          description="Last 30 days"
          icon={Calendar}
          iconClassName="bg-brand-teal/10 text-brand-teal"
        />
        <StatsCard
          title="Pending"
          value={appointmentStats.pending}
          description="Awaiting approval"
          icon={BarChart3}
          iconClassName="bg-brand-amber/10 text-brand-amber"
        />
        <StatsCard
          title="Completed"
          value={appointmentStats.completed}
          description="Finished visits"
          icon={BarChart3}
          iconClassName="bg-brand-eucalyptus/10 text-brand-eucalyptus"
        />
        <StatsCard
          title="Messages"
          value={messageStats.totalMessages}
          description={`${messageStats.unreadMessages} unread`}
          icon={MessageSquare}
          iconClassName="bg-brand-orange/10 text-brand-orange"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Appointments by Staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointmentStats.byStaff.length ? (
              appointmentStats.byStaff.slice(0, 10).map((row) => (
                <div key={row.staffProfileId} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{row.staffName}</div>
                  <div className="text-sm font-semibold text-brand-navy">{row.count}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No staff appointment data in range.</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">Messages by Staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messageStats.byStaff.length ? (
              messageStats.byStaff.slice(0, 10).map((row) => (
                <div key={row.staffUserId} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{row.staffName}</div>
                  <div className="text-sm font-semibold text-brand-navy">{row.messageCount}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No staff messaging data in range.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

