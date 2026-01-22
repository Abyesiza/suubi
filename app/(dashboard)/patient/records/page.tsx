"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ClipboardList, Search } from "lucide-react";

import Loader from "@/components/ui/Loader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function PatientRecordsPage() {
  const { user } = useUser();
  const [q, setQ] = useState("");

  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const appointments = useQuery(
    api.appointments.getPatientAppointmentsWithStaff,
    currentUser?._id ? { patientId: currentUser._id, limit: 200 } : "skip",
  );

  if (currentUser === undefined || appointments === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const records = useMemo(() => {
    const completed = appointments.filter((a: any) => a.status === "completed");
    const s = q.trim().toLowerCase();
    if (!s) return completed;
    return completed.filter((a: any) => {
      const staff = `${a.staffUser?.firstName || ""} ${a.staffUser?.lastName || ""}`.toLowerCase();
      const notes = (a.notes || "").toLowerCase();
      const reason = (a.reason || "").toLowerCase();
      return staff.includes(s) || notes.includes(s) || reason.includes(s);
    });
  }, [appointments, q]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Medical Records" description="Your completed visits and notes" />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input className="pl-9" placeholder="Search records…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-brand-navy" />
            Completed Visits
            <Badge variant="secondary" className="ml-2">
              {records.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.length ? (
            records.map((a: any) => (
              <div key={a._id} className="rounded-lg border border-gray-200 p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-brand-navy">
                      {a.staffUser ? `Dr. ${a.staffUser.firstName} ${a.staffUser.lastName}` : "Provider"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(a.appointmentDate), "MMM d, yyyy")} • {format(new Date(a.appointmentDate), "h:mm a")}
                    </div>
                  </div>
                  <StatusBadge status="completed" />
                </div>
                {a.reason && <div className="text-sm text-gray-700">Reason: {a.reason}</div>}
                {a.notes ? (
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">{a.notes}</div>
                ) : (
                  <div className="text-sm text-gray-400">No notes recorded.</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No completed records found.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

