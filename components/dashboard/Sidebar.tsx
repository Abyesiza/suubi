"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserPlus,
  FileText,
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  Activity,
  BarChart3,
  Heart,
  ClipboardList,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  role: "admin" | "staff" | "patient";
}

const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Appointments", href: "/admin/appointments", icon: Calendar },
  { title: "Staff Management", href: "/admin/staff", icon: Users },
  { title: "Patients", href: "/admin/patients", icon: UserPlus },
  { title: "News", href: "/admin/news", icon: Newspaper },
  { title: "Programs", href: "/admin/programs", icon: FileText },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const staffNavItems: NavItem[] = [
  { title: "Dashboard", href: "/staff-portal", icon: LayoutDashboard },
  { title: "My Appointments", href: "/staff-portal/appointments", icon: Calendar },
  { title: "Availability", href: "/staff-portal/availability", icon: Clock },
  { title: "My Patients", href: "/staff-portal/patients", icon: Users },
  { title: "Messages", href: "/staff-portal/messages", icon: MessageSquare },
  { title: "Profile", href: "/staff-portal/profile", icon: User },
];

const patientNavItems: NavItem[] = [
  { title: "My Health", href: "/patient", icon: Heart },
  { title: "Appointments", href: "/patient/appointments", icon: Calendar },
  { title: "Messages", href: "/patient/messages", icon: MessageSquare },
  { title: "Medical Records", href: "/patient/records", icon: ClipboardList },
  { title: "Profile", href: "/patient/profile", icon: User },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = role === "admin" 
    ? adminNavItems 
    : role === "staff" 
    ? staffNavItems 
    : patientNavItems;

  const roleTitle = role === "admin" 
    ? "Admin Portal" 
    : role === "staff" 
    ? "Staff Portal" 
    : "Patient Portal";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex h-screen flex-col border-r border-border bg-card",
        "shadow-sm"
      )}
    >
      {/* Logo and Title */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Suubi</span>
                <span className="text-xs text-muted-foreground">{roleTitle}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-teal text-white mx-auto">
            <Activity className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-brand-teal")} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
