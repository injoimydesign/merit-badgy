/**
 * @imagine-readonly
 * These should only be imported in server-side actions (SSR, functions).
 */

import { createClient } from '@supabase/supabase-js'

const getSupabaseCredentials = () => {
  const url = process.env.SUPABASE_URL
  if (!url) {
    throw new Error('SUPABASE_URL is not set')
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  const anonKey = process.env.SUPABASE_ANON_KEY
  if (!anonKey) {
    throw new Error('SUPABASE_ANON_KEY is not set')
  }

  return { url, serviceRoleKey, anonKey }
}

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseCredentials()
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function createSessionClient(accessToken: string, refreshToken: string) {
  const { url, anonKey } = getSupabaseCredentials()
  const client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })

  return client
}
