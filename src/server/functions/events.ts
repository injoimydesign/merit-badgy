import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/server/lib/db'
import { authMiddleware } from './auth'
import type { MeritBadgeEvent } from '@/server/lib/supabase.types'

// Schema for listing events with filters
const listEventsSchema = z.object({
  query: z.string().optional(),
  badgeName: z.string().optional(),
  subjectArea: z.string().optional(),
  isVirtual: z.boolean().optional(),
  isEagleRequired: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

export type ListEventsInput = z.infer<typeof listEventsSchema>

// List events with filters
export const listEventsFn = createServerFn({ method: 'GET' })
  .inputValidator(listEventsSchema.optional())
  .handler(async ({ data }) => {
    const filters = data ?? { limit: 20, offset: 0 }

    try {
      const result = await db.meritBadgeEvents.list({
        status: 'approved',
        badge_name: filters.badgeName,
        subject_area: filters.subjectArea,
        is_virtual: filters.isVirtual,
        is_eagle_required: filters.isEagleRequired,
        startDate: filters.startDate,
        endDate: filters.endDate,
        searchQuery: filters.query,
        limit: filters.limit,
        offset: filters.offset,
        orderBy: { column: 'event_date', ascending: true },
      })
      return {
        events: result.rows.map(serializeEvent),
        total: result.total,
      }
    } catch (error) {
      console.error('Error listing events:', error)
      return { events: [], total: 0 }
    }
  })

// Get a single event by ID
export const getEventFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    try {
      const event = await db.meritBadgeEvents.get(data.id)

      // Increment view count
      await db.meritBadgeEvents.update(data.id, {
        view_count: (event.view_count || 0) + 1,
      })

      return { event: serializeEvent(event) }
    } catch (error) {
      console.error('Error getting event:', error)
      return { event: null }
    }
  })

// Get featured/upcoming events for homepage
export const getFeaturedEventsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const today = new Date().toISOString().split('T')[0]

  try {
    const result = await db.meritBadgeEvents.list({
      status: 'approved',
      startDate: today,
      limit: 6,
      orderBy: { column: 'event_date', ascending: true },
    })

    return { events: result.rows.map(serializeEvent) }
  } catch (error) {
    console.error('Error getting featured events:', error)
    return { events: [] }
  }
})

// Get trending badges (most viewed/saved)
export const getTrendingBadgesFn = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const result = await db.meritBadgeEvents.list({
      status: 'approved',
      limit: 20,
      orderBy: { column: 'view_count', ascending: false },
    })

    // Group by badge name and count
    const badgeCounts = new Map<
      string,
      { count: number; isEagle: boolean; subjectArea: string | null }
    >()

    for (const event of result.rows) {
      const existing = badgeCounts.get(event.badge_name)
      if (existing) {
        existing.count++
      } else {
        badgeCounts.set(event.badge_name, {
          count: 1,
          isEagle: event.is_eagle_required,
          subjectArea: event.subject_area,
        })
      }
    }

    const trending = Array.from(badgeCounts.entries())
      .map(([name, data]) => ({
        name,
        classCount: data.count,
        isEagle: data.isEagle,
        subjectArea: data.subjectArea,
      }))
      .sort((a, b) => b.classCount - a.classCount)
      .slice(0, 6)

    return { badges: trending }
  } catch (error) {
    console.error('Error getting trending badges:', error)
    return { badges: [] }
  }
})

// Save/unsave an event (requires auth)
export const toggleSaveEventFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    try {
      const event = await db.meritBadgeEvents.get(data.eventId)
      await db.meritBadgeEvents.update(data.eventId, {
        save_count: (event.save_count || 0) + 1,
      })
      return { success: true }
    } catch (error) {
      console.error('Error saving event:', error)
      throw new Error('Failed to save event')
    }
  })

// Helper to serialize event for client
function serializeEvent(event: MeritBadgeEvent) {
  return {
    id: event.id,
    badgeName: event.badge_name,
    title: event.title,
    description: event.description,
    eventDate: event.event_date,
    eventTime: event.event_time,
    location: event.location,
    isVirtual: event.is_virtual,
    latitude: event.latitude,
    longitude: event.longitude,
    subjectArea: event.subject_area,
    isEagleRequired: event.is_eagle_required,
    prerequisites: event.prerequisites,
    organizerName: event.organizer_name,
    organizerContact: event.organizer_contact,
    registrationUrl: event.registration_url,
    sourceUrl: event.source_url,
    imageUrl: event.image_url,
    viewCount: event.view_count,
    saveCount: event.save_count,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }
}

export type SerializedEvent = ReturnType<typeof serializeEvent>
