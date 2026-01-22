"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Settings, Shield } from "lucide-react";

import Loader from "@/components/ui/Loader";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { user } = useUser();
  const currentUser = useQuery(api.users.getCurrentUser, { clerkId: user?.id || "" });
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip",
  );

  if (currentUser === undefined || staffProfile === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Settings" description="Admin settings and system configuration" />

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-brand-navy" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-700">
            Signed in as: <span className="font-medium text-brand-navy">{currentUser?.email}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-brand-orange text-white">Admin</Badge>
            {staffProfile?.verified && <Badge className="bg-green-600 text-white">Verified</Badge>}
            {staffProfile?.role && <Badge variant="secondary">{staffProfile.role}</Badge>}
          </div>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/admin/setup">
                <Shield className="mr-2 h-4 w-4" />
                Admin Setup
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

