import { getSupabaseSessionFn } from '../functions/auth'
import { createSessionClient } from './supabase'

const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET

export async function fileStorage() {
  if (!SUPABASE_STORAGE_BUCKET) {
    throw new Error('Missing SUPABASE_STORAGE_BUCKET environment variable')
  }

  const session = await getSupabaseSessionFn()

  if (!session) {
    console.error('No valid session found')
    return
  }

  const supabase = createSessionClient(session.accessToken, session.refreshToken)

  return {
    async create(_userId: string, file: File) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET!)
        .upload(filePath, file)

      if (error) throw error
      return data
    },

    async read(filePath: string) {
      const { data } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET!)
        .getPublicUrl(filePath)
      return data.publicUrl
    },

    async delete(filePath: string) {
      const { error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET!)
        .remove([filePath])
      if (error) throw error
    },

    async listFiles() {
      const { data, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET!)
        .list()
      if (error) throw error
      return data
    },

    async downloadFile(filePath: string) {
      const { data, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET!)
        .download(filePath)
      if (error) throw error
      return data
    },
  }
}
