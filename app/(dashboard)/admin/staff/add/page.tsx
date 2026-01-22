"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/ui/Loader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES = [
  "doctor",
  "nurse",
  "allied_health",
  "support_staff",
  "administrative_staff",
  "technical_staff",
  "training_research_staff",
  "editor",
] as const;

export default function AdminAddStaffPage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const createStaffProfile = useMutation(api.users.createStaffProfile);

  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<(typeof ROLES)[number]>("doctor");
  const [specialty, setSpecialty] = useState("");

  if (currentUser === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const onSubmit = async () => {
    if (!currentUser) return;
    if (!userId.trim()) {
      toast.error("Paste a valid Convex userId (users table _id).");
      return;
    }
    try {
      await createStaffProfile({
        userId: userId.trim() as any,
        role: role as any,
        specialty: specialty || undefined,
        createdBy: currentUser._id,
      });
      toast.success("Staff profile created");
      setUserId("");
      setSpecialty("");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create staff profile");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Add Staff" description="Promote an existing user to staff" />

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-brand-navy" />
            Create Staff Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>User ID (Convex `users` _id)</Label>
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder='e.g. "j57..."' />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <select
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Specialty (optional)</Label>
            <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Cardiology" />
          </div>

          <Button onClick={onSubmit} className="bg-brand-navy hover:bg-brand-navy/90">
            Create
          </Button>

          <div className="text-xs text-gray-500">
            Tip: if you’re getting redirected from <code>/admin</code> to <code>/patient</code>, your user likely
            doesn’t have an admin role in <code>staff_profiles</code>. Use <code>/admin/setup</code> (first admin)
            or create a staff profile with role <code>admin</code>/<code>superadmin</code> via Convex.
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

