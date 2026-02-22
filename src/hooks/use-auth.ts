import { signOutFn } from '@/server/functions/auth'
import { useLoaderData, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const { currentUser } = useLoaderData({ from: '__root__' }) as {
    currentUser: User | null
  }
  const signOutServer = useServerFn(signOutFn)
  const router = useRouter()

  const signOut = async () => {
    await signOutServer()
    await router.invalidate()
  }

  return {
    currentUser,
    signOut,
  }
}
