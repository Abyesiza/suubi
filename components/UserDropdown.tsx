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
import { SignOutButton, useUser } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'

export default function UserDropdown() {
  const { user: clerkUser } = useUser()
  const clerkId = clerkUser?.id

  const dbUser = useQuery(
    api.users.getCurrentUser,
    clerkId ? { clerkId } : undefined
  )

  const displayNameFromDb = dbUser
    ? dbUser.firstName || dbUser.lastName
      ? `${dbUser.firstName ?? ''} ${dbUser.lastName ?? ''}`.trim()
      : dbUser.email
    : undefined

  const displayName =
    displayNameFromDb ??
    clerkUser?.fullName ??
    clerkUser?.primaryEmailAddress?.emailAddress ??
    'Account'

  const avatarUrl = dbUser?.imageUrl || clerkUser?.imageUrl || null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-mustard text-dark-purple flex items-center justify-center text-sm font-semibold">
              {displayName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline text-dark-purple">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-mustard text-dark-purple flex items-center justify-center text-sm font-semibold">
                {displayName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-muted-foreground">
                {dbUser?.email ?? clerkUser?.primaryEmailAddress?.emailAddress ?? ''}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
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


