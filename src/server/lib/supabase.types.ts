import type { User } from '@supabase/supabase-js'

export type { User }

export type MeritBadgeEvent = {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  badge_name: string
  title: string
  description: string | null
  event_date: string
  event_time: string | null
  location: string | null
  is_virtual: boolean
  latitude: number | null
  longitude: number | null
  subject_area: string | null
  is_eagle_required: boolean
  prerequisites: string | null
  organizer_name: string | null
  organizer_contact: string | null
  registration_url: string | null
  source_url: string | null
  status: string
  image_url: string | null
  view_count: number
  save_count: number
}
