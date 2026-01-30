import { createFileRoute } from '@tanstack/react-router'
import { EventDetailPage } from '@/components/event/EventDetailPage'

export const Route = createFileRoute('/_public/event/$eventId')({
  component: EventDetailPage,
})
