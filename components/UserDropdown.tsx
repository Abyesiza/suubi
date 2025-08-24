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
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export default function UserDropdown() {
  const user = useQuery(api.users.getCurrentUser, {})

  const displayName = user
    ? user.firstName || user.lastName
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : user.email
    : 'Account'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-mustard text-dark-purple flex items-center justify-center text-sm font-semibold">
              {displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline text-dark-purple">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Add extra items as needed, e.g., Profile/Settings */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOutButton>
            <button className="w-full flex items-center gap-2 text-left">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


