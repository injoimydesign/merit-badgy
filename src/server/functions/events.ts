import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/server/lib/db'
import { Query } from 'node-appwrite'
import { authMiddleware } from './auth'
import type { MeritBadgeEvents } from '@/server/lib/appwrite.types'

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
    const queries: string[] = [
      Query.equal('status', ['approved']),
      Query.orderAsc('eventDate'),
      Query.limit(filters.limit),
      Query.offset(filters.offset),
    ]

    // Add search query filter
    if (filters.query) {
      queries.push(Query.search('badgeName', filters.query))
    }

    // Add badge name filter
    if (filters.badgeName) {
      queries.push(Query.equal('badgeName', [filters.badgeName]))
    }

    // Add subject area filter
    if (filters.subjectArea) {
      queries.push(Query.equal('subjectArea', [filters.subjectArea]))
    }

    // Add virtual filter
    if (filters.isVirtual !== undefined) {
      queries.push(Query.equal('isVirtual', [filters.isVirtual]))
    }

    // Add eagle required filter
    if (filters.isEagleRequired !== undefined) {
      queries.push(Query.equal('isEagleRequired', [filters.isEagleRequired]))
    }

    // Add date range filters
    if (filters.startDate) {
      queries.push(Query.greaterThanEqual('eventDate', filters.startDate))
    }

    if (filters.endDate) {
      queries.push(Query.lessThanEqual('eventDate', filters.endDate))
    }

    try {
      const result = await db.meritBadgeEvents.list(queries)
      return {
        events: result.rows.map(serializeEvent),
        total: result.total,
      }
    } catch (error) {
      console.error('Error listing events:', error)
      return {
        events: [],
        total: 0,
      }
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
        viewCount: (event.viewCount || 0) + 1,
      })

      return { event: serializeEvent(event) }
    } catch (error) {
      console.error('Error getting event:', error)
      return { event: null }
    }
  })

// Get featured/upcoming events for homepage
export const getFeaturedEventsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const today = new Date().toISOString().split('T')[0]

    try {
      const result = await db.meritBadgeEvents.list([
        Query.equal('status', ['approved']),
        Query.greaterThanEqual('eventDate', today),
        Query.orderAsc('eventDate'),
        Query.limit(6),
      ])

      return {
        events: result.rows.map(serializeEvent),
      }
    } catch (error) {
      console.error('Error getting featured events:', error)
      return { events: [] }
    }
  },
)

// Get trending badges (most viewed/saved)
export const getTrendingBadgesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const result = await db.meritBadgeEvents.list([
        Query.equal('status', ['approved']),
        Query.orderDesc('viewCount'),
        Query.limit(20),
      ])

      // Group by badge name and count
      const badgeCounts = new Map<
        string,
        { count: number; isEagle: boolean; subjectArea: string | null }
      >()

      for (const event of result.rows) {
        const existing = badgeCounts.get(event.badgeName)
        if (existing) {
          existing.count++
        } else {
          badgeCounts.set(event.badgeName, {
            count: 1,
            isEagle: event.isEagleRequired,
            subjectArea: event.subjectArea,
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
  },
)

// Save/unsave an event (requires auth)
export const toggleSaveEventFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ eventId: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) {
      throw new Error('Unauthorized')
    }

    // For now, just increment the save count
    // In a full implementation, we'd track which users saved which events
    try {
      const event = await db.meritBadgeEvents.get(data.eventId)
      await db.meritBadgeEvents.update(data.eventId, {
        saveCount: (event.saveCount || 0) + 1,
      })
      return { success: true }
    } catch (error) {
      console.error('Error saving event:', error)
      throw new Error('Failed to save event')
    }
  })

// Helper to serialize event for client
function serializeEvent(event: MeritBadgeEvents) {
  return {
    id: event.$id,
    badgeName: event.badgeName,
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    eventTime: event.eventTime,
    location: event.location,
    isVirtual: event.isVirtual,
    latitude: event.latitude,
    longitude: event.longitude,
    subjectArea: event.subjectArea,
    isEagleRequired: event.isEagleRequired,
    prerequisites: event.prerequisites,
    organizerName: event.organizerName,
    organizerContact: event.organizerContact,
    registrationUrl: event.registrationUrl,
    sourceUrl: event.sourceUrl,
    imageUrl: event.imageUrl,
    viewCount: event.viewCount,
    saveCount: event.saveCount,
    createdAt: event.$createdAt,
    updatedAt: event.$updatedAt,
  }
}

export type SerializedEvent = ReturnType<typeof serializeEvent>
