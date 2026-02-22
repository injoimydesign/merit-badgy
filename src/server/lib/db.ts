import { createAdminClient } from './supabase'
import type { MeritBadgeEvent } from './supabase.types'

const TABLE = 'merit_badge_events'

export const db = {
  meritBadgeEvents: {
    create: async (data: Omit<MeritBadgeEvent, 'id' | 'created_at' | 'updated_at'>) => {
      const supabase = createAdminClient()
      const { data: row, error } = await supabase
        .from(TABLE)
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row as MeritBadgeEvent
    },

    get: async (id: string) => {
      const supabase = createAdminClient()
      const { data: row, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return row as MeritBadgeEvent
    },

    update: async (
      id: string,
      data: Partial<Omit<MeritBadgeEvent, 'id' | 'created_at' | 'updated_at'>>,
    ) => {
      const supabase = createAdminClient()
      const { data: row, error } = await supabase
        .from(TABLE)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return row as MeritBadgeEvent
    },

    delete: async (id: string) => {
      const supabase = createAdminClient()
      const { error } = await supabase.from(TABLE).delete().eq('id', id)
      if (error) throw error
    },

    list: async (filters?: {
      status?: string
      badge_name?: string
      subject_area?: string
      is_virtual?: boolean
      is_eagle_required?: boolean
      startDate?: string
      endDate?: string
      searchQuery?: string
      limit?: number
      offset?: number
      orderBy?: { column: string; ascending: boolean }
    }) => {
      const supabase = createAdminClient()
      let query = supabase.from(TABLE).select('*', { count: 'exact' })

      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.badge_name) query = query.eq('badge_name', filters.badge_name)
      if (filters?.subject_area) query = query.eq('subject_area', filters.subject_area)
      if (filters?.is_virtual !== undefined) query = query.eq('is_virtual', filters.is_virtual)
      if (filters?.is_eagle_required !== undefined)
        query = query.eq('is_eagle_required', filters.is_eagle_required)
      if (filters?.startDate) query = query.gte('event_date', filters.startDate)
      if (filters?.endDate) query = query.lte('event_date', filters.endDate)
      if (filters?.searchQuery) query = query.ilike('badge_name', `%${filters.searchQuery}%`)

      const orderBy = filters?.orderBy ?? { column: 'event_date', ascending: true }
      query = query.order(orderBy.column, { ascending: orderBy.ascending })

      const limit = filters?.limit ?? 20
      const offset = filters?.offset ?? 0
      query = query.range(offset, offset + limit - 1)

      const { data: rows, error, count } = await query
      if (error) throw error
      return { rows: (rows ?? []) as MeritBadgeEvent[], total: count ?? 0 }
    },
  },
}
