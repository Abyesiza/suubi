"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import Loader from "@/components/ui/Loader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get current user from Convex
  const currentUser = useQuery(api.users.getCurrentUser, {
    clerkId: user?.id || "",
  });

  // Get staff profile if exists
  const staffProfile = useQuery(
    api.staffProfiles.getStaffProfileByUserId,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Determine user role
  const role = staffProfile
    ? ["admin", "superadmin"].includes(staffProfile.role)
      ? "admin"
      : ["doctor", "nurse", "allied_health"].includes(staffProfile.role)
      ? "staff"
      : "staff"
    : "patient";

  // Determine which dashboard the user should be on
  const rolePathMap: Record<string, string> = {
    admin: "admin",
    staff: "staff-portal",
    patient: "patient"
  };
  const currentSection = pathname.split("/")[1]; // admin, staff-portal, or patient

  // Check if user has access to current section
  useEffect(() => {
    if (!isUserLoaded || currentUser === undefined || staffProfile === undefined) return;

    // If no user, redirect to sign-in
    if (!user || !currentUser) {
      router.push("/sign-in");
      return;
    }

    // Allow initial admin bootstrap route without redirect loops
    if (pathname.startsWith("/admin/setup")) {
      return;
    }

    // Redirect based on role if accessing wrong dashboard
    const expectedSection = rolePathMap[role];
    
    // Only redirect if user is on the wrong dashboard for their role
    // Admin can access any dashboard, so skip redirects for admins
    if (role === "admin") {
      return; // Admins can go anywhere
    }

    if (currentSection !== expectedSection) {
      // Redirect staff trying to access admin or patient portals
      if (role === "staff" && (currentSection === "admin" || currentSection === "patient")) {
        router.push("/staff-portal");
        return;
      }

      // Redirect patients trying to access admin or staff portal
      if (role === "patient" && (currentSection === "admin" || currentSection === "staff-portal")) {
        router.push("/patient");
        return;
      }
    }
  }, [isUserLoaded, user, currentUser, staffProfile, currentSection, role, router, rolePathMap, pathname]);

  // Loading state
  if (!isUserLoaded || currentUser === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || !currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-brand-navy border-r-0">
          <Sidebar role={role} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header role={role} onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
