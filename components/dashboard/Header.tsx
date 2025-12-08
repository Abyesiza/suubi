"use client";

import { useUser } from "@clerk/nextjs";
import { Bell, Search, Menu } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
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
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-8 bg-background"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] text-white">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">New appointment request</p>
              <p className="text-xs text-muted-foreground">
                John Doe requested an appointment for tomorrow
              </p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <p className="text-sm font-medium">Appointment confirmed</p>
              <p className="text-xs text-muted-foreground">
                Your appointment with Dr. Smith has been confirmed
              </p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-brand-teal">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback className="bg-brand-teal text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium">
                  {user?.fullName || "User"}
                </span>
                <Badge className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor()}`}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${role}/profile`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${role}/settings`}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Back to Website</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton>
              <DropdownMenuItem className="text-destructive cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
