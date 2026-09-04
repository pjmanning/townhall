import { useAuth, useClerk, useUser } from '@clerk/tanstack-react-start'
import { isClerkConfigured } from './env'

/**
 * Clerk hooks that stay callable when Clerk isn't configured.
 *
 * The implementation is chosen once at module load (the key can't change at
 * runtime), so hook order is stable and rules-of-hooks still holds.
 */

export interface AppAuth {
  isLoaded: boolean
  isSignedIn: boolean
  userId: string | null
  configured: boolean
}

const unconfiguredAuth = (): AppAuth => ({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  configured: false,
})

const configuredAuth = (): AppAuth => {
  const { isLoaded, isSignedIn, userId } = useAuth()
  return {
    isLoaded: Boolean(isLoaded),
    isSignedIn: Boolean(isSignedIn),
    userId: userId ?? null,
    configured: true,
  }
}

export const useAppAuth: () => AppAuth = isClerkConfigured ? configuredAuth : unconfiguredAuth

export interface AppUser {
  fullName: string | null
  primaryEmail: string | null
  imageUrl: string | null
}

const unconfiguredUser = (): AppUser => ({ fullName: null, primaryEmail: null, imageUrl: null })

const configuredUser = (): AppUser => {
  const { user } = useUser()
  return {
    fullName: user?.fullName ?? null,
    primaryEmail: user?.primaryEmailAddress?.emailAddress ?? null,
    imageUrl: user?.imageUrl ?? null,
  }
}

export const useAppUser: () => AppUser = isClerkConfigured ? configuredUser : unconfiguredUser

type SignOut = (redirectUrl?: string) => Promise<void>

const unconfiguredSignOut = (): SignOut => async () => {}

const configuredSignOut = (): SignOut => {
  const { signOut } = useClerk()
  return async (redirectUrl = '/') => {
    await signOut({ redirectUrl })
  }
}

export const useSignOut: () => SignOut = isClerkConfigured ? configuredSignOut : unconfiguredSignOut
