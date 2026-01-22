"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Search, Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

interface HeaderProps {
  role: "admin" | "staff" | "patient";
  onMobileMenuToggle?: () => void;
}

export function Header({ role, onMobileMenuToggle }: HeaderProps) {
  const { user } = useUser();

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case "admin":
        return "bg-brand-orange text-white";
      case "staff":
        return "bg-brand-teal text-white";
      case "patient":
        return "bg-brand-eucalyptus text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProfileLink = () => {
    switch (role) {
      case "admin":
        return "/admin/settings";
      case "staff":
        return "/staff-portal/profile";
      case "patient":
        return "/patient/profile";
      default:
        return "/";
    }
  };

  const getSettingsLink = () => {
    switch (role) {
      case "admin":
        return "/admin/settings";
      case "staff":
        return "/staff-portal/settings";
      case "patient":
        return "/patient/settings";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-4 md:px-6 shadow-sm">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search */}
      <div className="flex-1 md:flex-initial">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-72 pl-9 bg-gray-50 border-gray-200 rounded-lg focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Back to Website */}
        <Button variant="ghost" size="sm" asChild className="hidden md:flex text-gray-600 hover:text-brand-navy">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Website
          </Link>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-brand-navy">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] text-white font-medium">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <p className="text-sm font-medium text-brand-navy">New appointment request</p>
              <p className="text-xs text-gray-500">
                John Doe requested an appointment for tomorrow
              </p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
              <p className="text-sm font-medium text-brand-navy">Appointment confirmed</p>
              <p className="text-xs text-gray-500">
                Your appointment with Dr. Smith has been confirmed
              </p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-brand-teal font-medium cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-50">
              <Avatar className="h-9 w-9 border-2 border-gray-100 shadow-sm">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-brand-navy text-white font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-semibold text-brand-navy">
                  {user?.fullName || "User"}
                </span>
                <Badge className={`text-[10px] px-1.5 py-0 h-4 ${getRoleBadgeColor()}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={getProfileLink()} className="cursor-pointer">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={getSettingsLink()} className="cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">Back to Website</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
