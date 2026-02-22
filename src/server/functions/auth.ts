import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { redirect } from '@tanstack/react-router'
import { createAdminClient, createSessionClient } from '../lib/supabase'
import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseStatus,
  getRequestHeader,
} from '@tanstack/react-start/server'

export const getSupabaseSessionFn = createServerFn({ method: 'GET' }).handler(async () => {
  const accessToken = getCookie('sb-access-token')
  const refreshToken = getCookie('sb-refresh-token')

  if (!accessToken || !refreshToken) {
    return null
  }

  return { accessToken, refreshToken }
})

const setSupabaseSessionCookiesSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number().optional(),
})

export const setSupabaseSessionCookiesFn = createServerFn({ method: 'POST' })
  .inputValidator(setSupabaseSessionCookiesSchema)
  .handler(async ({ data }: { data: z.infer<typeof setSupabaseSessionCookiesSchema> }) => {
    const { accessToken, refreshToken, expiresAt } = data

    let maxAge = 30 * 24 * 60 * 60 // Default: 30 days in seconds
    if (expiresAt) {
      const now = Math.floor(Date.now() / 1000)
      maxAge = Math.max(0, expiresAt - now)
    }

    setCookie('sb-access-token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
      path: '/',
    })

    setCookie('sb-refresh-token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60, // Refresh tokens are long-lived
      path: '/',
    })
  })

const signUpInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirect: z.string().optional(),
})

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data
    const supabase = createAdminClient()

    const { data: authData, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setResponseStatus(error.status ?? 400)
      throw { message: error.message, status: error.status ?? 400 }
    }

    if (authData.session) {
      await setSupabaseSessionCookiesFn({
        data: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresAt: authData.session.expires_at,
        },
      })
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data
    const supabase = createAdminClient()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setResponseStatus(error.status ?? 400)
      throw { message: error.message, status: error.status ?? 400 }
    }

    await setSupabaseSessionCookiesFn({
      data: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at,
      },
    })

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signOutFn = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const session = await getSupabaseSessionFn()

    if (session) {
      const supabase = createSessionClient(session.accessToken, session.refreshToken)
      await supabase.auth.signOut()
    }
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    clearAuthCookies()
  }
})

export const authMiddleware = createServerFn({ method: 'GET' }).handler(async () => {
  const currentUser = await getCurrentUser()
  return { currentUser }
})

const clearAuthCookies = () => {
  deleteCookie('sb-access-token')
  deleteCookie('sb-refresh-token')
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSupabaseSessionFn()

  if (!session) {
    return null
  }

  try {
    const supabase = createSessionClient(session.accessToken, session.refreshToken)
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      if (error.status === 401) {
        clearAuthCookies()
      }
      return null
    }

    return data.user
  } catch {
    return null
  }
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const forgotPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    const { email } = data
    const supabase = createAdminClient()

    const origin = getRequestHeader('origin')
    if (!origin) {
      throw new Error('Missing origin header')
    }
    const resetUrl = `${origin}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl,
    })

    if (error) {
      setResponseStatus(error.status ?? 400)
      throw { message: error.message, status: error.status ?? 400 }
    }

    return {
      success: true,
      message: 'Password recovery email sent successfully',
    }
  })

const resetPasswordSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export const resetPasswordFn = createServerFn({ method: 'POST' })
  .inputValidator(resetPasswordSchema)
  .handler(async ({ data }) => {
    const { accessToken, refreshToken, password, confirmPassword } = data

    if (password !== confirmPassword) {
      setResponseStatus(400)
      throw { message: 'Passwords do not match', status: 400 }
    }

    const supabase = createSessionClient(accessToken, refreshToken)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setResponseStatus(error.status ?? 400)
      throw { message: error.message, status: error.status ?? 400 }
    }

    return {
      success: true,
      message: 'Password reset successfully',
    }
  })
