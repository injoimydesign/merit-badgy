import { Mail, Phone, ExternalLink, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SerializedEvent } from '@/server/functions/events'
import { motion } from 'motion/react'

interface EventOrganizerProps {
  event: SerializedEvent
}

export function EventOrganizer({ event }: EventOrganizerProps) {
  const hasOrganizerInfo = event.organizerName || event.organizerContact

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-[#1e3a5f]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-gray-900">Organizer</h2>
          <p className="text-sm text-gray-600">Event host information</p>
        </div>
      </div>

      {hasOrganizerInfo ? (
        <div className="space-y-4">
          {event.organizerName && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-semibold text-gray-900">
                {event.organizerName}
              </p>
            </div>
          )}

          {event.organizerContact && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Contact</p>
              <div className="space-y-2">
                {/* Check if it's an email */}
                {event.organizerContact.includes('@') ? (
                  <a
                    href={`mailto:${event.organizerContact}`}
                    className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#d4a84b] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{event.organizerContact}</span>
                  </a>
                ) : event.organizerContact.match(
                    /^\d{10}$|^\(\d{3}\)\s?\d{3}-\d{4}$/,
                  ) ? (
                  // Check if it's a phone number
                  <a
                    href={`tel:${event.organizerContact}`}
                    className="flex items-center gap-2 text-[#1e3a5f] hover:text-[#d4a84b] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{event.organizerContact}</span>
                  </a>
                ) : (
                  // Generic contact info
                  <p className="text-sm text-gray-700">
                    {event.organizerContact}
                  </p>
                )}
              </div>
            </div>
          )}

          {event.registrationUrl && (
            <div className="pt-4 border-t border-gray-100">
              <Button
                asChild
                className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
              >
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Register Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}

          {event.sourceUrl && (
            <div>
              <Button asChild variant="outline" className="w-full">
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  View Original Listing
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-4">
            Organizer information not available
          </p>
          {event.sourceUrl && (
            <Button asChild variant="outline" className="w-full">
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                View Original Listing
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}
