"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/ui/Loader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSetupPage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip",
  );

  const createFirstAdmin = useMutation(api.staffProfiles.createFirstAdmin);

  if (currentUser === undefined || staffProfile === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const isAdmin = staffProfile && ["admin", "superadmin"].includes(staffProfile.role);

  const onBecomeFirstAdmin = async () => {
    if (!currentUser) return;
    try {
      await createFirstAdmin({ userId: currentUser._id });
      toast.success("You are now the first admin. Reloading…");
      window.location.href = "/admin";
    } catch (e: any) {
      toast.error(e?.message || "Failed to create first admin");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Admin Setup"
        description="Bootstrap the first admin account (only needed once)."
      />

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-navy" />
            First Admin Bootstrap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdmin ? (
            <div className="text-sm text-gray-700">
              Your account is already an admin. Nothing to do.
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-brand-amber/30 bg-brand-amber/10 p-4">
                <AlertTriangle className="h-5 w-5 text-brand-amber flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  This button will make <span className="font-semibold">{currentUser?.email}</span> the
                  first admin <strong>only if no admin exists yet</strong>.
                </div>
              </div>
              <Button className="bg-brand-navy hover:bg-brand-navy/90" onClick={onBecomeFirstAdmin}>
                Become First Admin
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

