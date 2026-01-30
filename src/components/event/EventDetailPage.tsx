import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getEventFn, listEventsFn } from '@/server/functions/events'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { EventHeader } from './EventHeader'
import { EventDetails } from './EventDetails'
import { EventOrganizer } from './EventOrganizer'
import { ReminderSignup } from './ReminderSignup'
import { RelatedEvents } from './RelatedEvents'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EventDetailPage() {
  const { eventId } = useParams({ from: '/_public/event/$eventId' })
  const navigate = useNavigate()

  // Fetch event details
  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventFn({ data: { id: eventId } }),
  })

  // Fetch related events (same badge)
  const { data: relatedData } = useQuery({
    queryKey: ['related-events', eventData?.event?.badgeName],
    queryFn: () =>
      listEventsFn({
        data: {
          badgeName: eventData?.event?.badgeName,
          limit: 4,
        },
      }),
    enabled: !!eventData?.event?.badgeName,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !eventData?.event) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the event you're looking for. It may have been
              removed or the link is incorrect.
            </p>
            <Button onClick={() => navigate({ to: '/search' })}>
              Browse all classes
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const event = eventData.event
  const relatedEvents =
    relatedData?.events?.filter((e) => e.id !== event.id) || []

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Back button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate({ to: '/search' })}
              className="flex items-center gap-2 text-gray-600 hover:text-[#1e3a5f] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to search</span>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <EventHeader event={event} />
              <EventDetails event={event} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ReminderSignup event={event} />
              <EventOrganizer event={event} />
            </div>
          </div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div className="mt-12">
              <RelatedEvents
                events={relatedEvents}
                badgeName={event.badgeName}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
