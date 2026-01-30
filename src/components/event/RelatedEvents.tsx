import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { SerializedEvent } from '@/server/functions/events'
import { motion } from 'motion/react'
import { format } from 'date-fns'

interface RelatedEventsProps {
  events: SerializedEvent[]
  badgeName: string
}

export function RelatedEvents({ events, badgeName }: RelatedEventsProps) {
  const navigate = useNavigate()

  if (events.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            More {badgeName} Classes
          </h2>
          <p className="text-gray-600 mt-1">
            Other opportunities to earn this merit badge
          </p>
        </div>
        <button
          onClick={() =>
            navigate({
              to: '/search',
              search: { badgeName },
            })
          }
          className="text-[#1e3a5f] hover:text-[#d4a84b] font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event, index) => (
          <RelatedEventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </motion.section>
  )
}

interface RelatedEventCardProps {
  event: SerializedEvent
  index: number
}

function RelatedEventCard({ event, index }: RelatedEventCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: '/event/$eventId',
      params: { eventId: event.id },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), 'MMM d, yyyy')
    : 'Date TBD'

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#d4a84b]/30 transition-all cursor-pointer group"
    >
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 group-hover:text-[#1e3a5f] transition-colors line-clamp-2 min-h-[3rem]">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d4a84b] flex-shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4a84b] flex-shrink-0" />
            <span className="truncate">{event.location || 'Location TBD'}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {event.isVirtual ? 'Virtual' : 'In-person'}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.article>
  )
}
