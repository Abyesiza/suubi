'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SignOutButton, useUser } from '@clerk/nextjs'
import { 
  LogOut, 
  LayoutDashboard, 
  User, 
  Settings, 
  ChevronDown,
  Shield,
  Stethoscope,
  Heart,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function UserDropdown() {
  const { user: clerkUser, isSignedIn } = useUser()
  const clerkId = clerkUser?.id

  const userWithRole = useQuery(
    api.users.getCurrentUserWithRole,
    clerkId ? { clerkId } : "skip"
  )

  const displayName = userWithRole
    ? userWithRole.firstName || userWithRole.lastName
      ? `${userWithRole.firstName ?? ''} ${userWithRole.lastName ?? ''}`.trim()
      : userWithRole.email
    : clerkUser?.fullName ?? clerkUser?.primaryEmailAddress?.emailAddress ?? 'Account'

  const avatarUrl = userWithRole?.imageUrl || clerkUser?.imageUrl || null

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      patient: 'Patient',
      admin: 'Admin',
      superadmin: 'Super Admin',
      doctor: 'Doctor',
      nurse: 'Nurse',
      allied_health: 'Allied Health',
      support_staff: 'Support Staff',
      administrative_staff: 'Admin Staff',
      technical_staff: 'Technical Staff',
      training_research_staff: 'Research Staff',
      editor: 'Editor',
    }
    return labels[role] || role
  }

  const getRoleIcon = (role: string) => {
    if (['admin', 'superadmin'].includes(role)) return Shield
    if (['doctor', 'nurse', 'allied_health'].includes(role)) return Stethoscope
    return Heart
  }

  const getRoleBadgeStyle = (role: string) => {
    if (['admin', 'superadmin'].includes(role)) {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    }
    if (['doctor', 'nurse', 'allied_health'].includes(role)) {
      return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20'
    }
    return 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
  }

  const RoleIcon = userWithRole ? getRoleIcon(userWithRole.role) : Heart

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-teal/20" 
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white flex items-center justify-center text-sm font-semibold ring-2 ring-brand-orange/20">
              {displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        <DropdownMenuLabel className="p-0">
          <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" 
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-amber-500 text-white flex items-center justify-center text-lg font-semibold ring-2 ring-white shadow-md">
                {displayName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {userWithRole?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? ''}
              </span>
              {userWithRole && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "mt-1.5 w-fit text-[10px] px-2 py-0.5 font-medium flex items-center gap-1",
                    getRoleBadgeStyle(userWithRole.role)
                  )}
                >
                  <RoleIcon className="h-3 w-3" />
                  {getRoleLabel(userWithRole.role)}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuGroup>
          {userWithRole && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link 
                href={userWithRole.dashboardPath}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-teal/5 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-brand-teal/10">
                  <LayoutDashboard className="h-4 w-4 text-brand-teal" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Dashboard</span>
                  <span className="text-xs text-gray-500">
                    {userWithRole.role === 'patient' ? 'View your health info' : 'Manage your workspace'}
                  </span>
                </div>
              </Link>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link 
              href="/appointments"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-orange/5 transition-colors"
            >
              <div className="p-1.5 rounded-md bg-brand-orange/10">
                <User className="h-4 w-4 text-brand-orange" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">My Appointments</span>
                <span className="text-xs text-gray-500">Book or view appointments</span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link 
            href="/contact"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Help & Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-red-50 text-red-600 transition-colors">
              <div className="p-1.5 rounded-md bg-red-100">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
