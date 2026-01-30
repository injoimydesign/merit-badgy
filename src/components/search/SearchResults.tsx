import {
  Calendar,
  MapPin,
  Clock,
  Bookmark,
  ChevronRight,
  Award,
  Monitor,
  Loader2,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import type { SerializedEvent } from '@/server/functions/events'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface SearchResultsProps {
  events: SerializedEvent[]
  isLoading: boolean
  error: Error | null
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function SearchResults({
  events,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: SearchResultsProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't load the classes. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No classes found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms to find more results.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/search', search: {} })}
          >
            Clear all filters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}

interface EventCardProps {
  event: SerializedEvent
  index: number
}

function EventCard({ event, index }: EventCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    void navigate({
      to: '/event/$eventId',
      params: { eventId: event.id },
    })
  }

  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), 'EEEE, MMM d, yyyy')
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
      {/* Image or placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {event.isEagleRequired && (
            <span className="px-2 py-1 bg-[#d4a84b] text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              Eagle Required
            </span>
          )}
          {event.isVirtual && (
            <span className="px-2 py-1 bg-[#1e3a5f] text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              Virtual
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // TODO: Implement save functionality
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Bookmark className="w-4 h-4 text-gray-600" />
        </button>

        {/* Badge name */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-semibold text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            {event.badgeName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-[#1e3a5f] transition-colors line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d4a84b] flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
          {event.eventTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4a84b] flex-shrink-0" />
              <span>{event.eventTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#d4a84b] flex-shrink-0" />
            <span className="truncate">{event.location || 'Location TBD'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {event.viewCount > 0 && <span>{event.viewCount} views</span>}
            {event.saveCount > 0 && <span>{event.saveCount} saved</span>}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.article>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = []
  const maxVisible = 7

  if (totalPages <= maxVisible) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show first, last, current, and surrounding pages
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1) // Ellipsis
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
      pages.push(-2)
      pages.push(totalPages)
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="disabled:opacity-50"
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                                w-10 h-10 rounded-lg font-medium transition-all
                                ${
                                  currentPage === page
                                    ? 'bg-[#1e3a5f] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }
                            `}
            >
              {page}
            </button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  )
}
