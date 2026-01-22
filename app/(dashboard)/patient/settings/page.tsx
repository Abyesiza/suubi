"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Settings" description="Patient preferences and settings" />
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-brand-navy" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          Settings will live here (notifications, privacy, and communication preferences).
        </CardContent>
      </Card>
    </motion.div>
  );
}

