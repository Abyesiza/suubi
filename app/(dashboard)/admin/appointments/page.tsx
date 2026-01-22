"use client";

import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Filter, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/ui/Loader";
import { StatusBadge } from "@/components/shared/StatusBadge";

const STATUSES = [
  "all",
  "pending",
  "approved",
  "confirmed",
  "completed",
  "cancelled",
  "rescheduled",
  "no_show",
] as const;

export default function AdminAppointmentsPage() {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const staffMembers = useQuery(api.users.getStaffMembers, { limit: 200 });

  const appointments = useQuery(
    api.appointments.getAllAppointmentsForAdmin,
    currentUser?._id
      ? {
          adminUserId: currentUser._id,
          status: status === "all" ? undefined : (status as any),
          limit: 200,
        }
      : "skip",
  );

  if (currentUser === undefined || staffMembers === undefined || appointments === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;
    return appointments.filter((apt: any) => {
      const patientName = `${apt.patient?.firstName || ""} ${apt.patient?.lastName || ""}`.toLowerCase();
      const staffName = `${apt.staffUser?.firstName || ""} ${apt.staffUser?.lastName || ""}`.toLowerCase();
      const reason = (apt.reason || "").toLowerCase();
      return patientName.includes(q) || staffName.includes(q) || reason.includes(q);
    });
  }, [appointments, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Appointments" description="All appointments across the system">
        <Badge variant="secondary" className="bg-brand-teal/10 text-brand-teal">
          {filtered.length} results
        </Badge>
      </PageHeader>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, staff, or reason…"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-full md:w-[220px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-navy" />
            Appointment List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((apt: any) => (
                    <TableRow key={apt._id}>
                      <TableCell>
                        <div className="font-medium text-brand-navy">
                          {format(new Date(apt.appointmentDate), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(apt.appointmentDate), "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {apt.patient ? `${apt.patient.firstName || ""} ${apt.patient.lastName || ""}`.trim() : "—"}
                      </TableCell>
                      <TableCell>
                        {apt.staffUser ? `${apt.staffUser.firstName || ""} ${apt.staffUser.lastName || ""}`.trim() : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={apt.status} />
                      </TableCell>
                      <TableCell className="max-w-[420px] truncate text-gray-600">
                        {apt.reason || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden p-4 space-y-3">
            {filtered.length ? (
              filtered.map((apt: any) => (
                <Card key={apt._id} className="shadow-sm">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-brand-navy">
                          {format(new Date(apt.appointmentDate), "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(apt.appointmentDate), "h:mm a")}
                        </div>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Patient:</span>{" "}
                      <span className="text-gray-800">
                        {apt.patient ? `${apt.patient.firstName || ""} ${apt.patient.lastName || ""}`.trim() : "—"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Staff:</span>{" "}
                      <span className="text-gray-800">
                        {apt.staffUser ? `${apt.staffUser.firstName || ""} ${apt.staffUser.lastName || ""}`.trim() : "—"}
                      </span>
                    </div>
                    {apt.reason && <div className="text-sm text-gray-600 line-clamp-2">{apt.reason}</div>}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">No appointments found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

