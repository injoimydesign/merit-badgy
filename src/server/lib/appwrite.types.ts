import { type Models } from 'node-appwrite'

export type MeritBadgeEvents = Models.Row & {
  createdBy: string
  badgeName: string
  title: string
  description: string | null
  eventDate: string
  eventTime: string | null
  location: string | null
  isVirtual: boolean
  latitude: number | null
  longitude: number | null
  subjectArea: string | null
  isEagleRequired: boolean
  prerequisites: string | null
  organizerName: string | null
  organizerContact: string | null
  registrationUrl: string | null
  sourceUrl: string | null
  status: string
  imageUrl: string | null
  viewCount: number
  saveCount: number
}
