import {
  Calendar,
  MapPin,
  Clock,
  Award,
  Monitor,
  Bookmark,
  Share2,
  Printer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { SerializedEvent } from '@/server/functions/events'
import { motion } from 'motion/react'
import { toast } from 'sonner'

interface EventHeaderProps {
  event: SerializedEvent
}

export function EventHeader({ event }: EventHeaderProps) {
  const formattedDate = event.eventDate
    ? format(new Date(event.eventDate), 'EEEE, MMMM d, yyyy')
    : 'Date TBD'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this ${event.badgeName} merit badge class!`,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success('Event saved to your list!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
    >
      {/* Hero image */}
      <div className="relative h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-24 h-24 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {event.isEagleRequired && (
            <span className="px-3 py-1.5 bg-[#d4a84b] text-white text-sm font-semibold rounded-full flex items-center gap-1.5 shadow-lg">
              <Award className="w-4 h-4" />
              Eagle Required
            </span>
          )}
          {event.isVirtual && (
            <span className="px-3 py-1.5 bg-[#1e3a5f] text-white text-sm font-semibold rounded-full flex items-center gap-1.5 shadow-lg">
              <Monitor className="w-4 h-4" />
              Virtual Class
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleSave}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            aria-label="Save event"
          >
            <Bookmark className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            aria-label="Share event"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handlePrint}
            className="hidden sm:flex w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white transition-colors shadow-lg"
            aria-label="Print event"
          >
            <Printer className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Badge name */}
        <div className="absolute bottom-4 left-4">
          <span className="text-white font-bold text-lg bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            {event.badgeName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-6">
          {event.title}
        </h1>

        {/* Key details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#d4a84b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#d4a84b]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-900">{formattedDate}</p>
            </div>
          </div>

          {event.eventTime && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#d4a84b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#d4a84b]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Time</p>
                <p className="font-semibold text-gray-900">{event.eventTime}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 sm:col-span-2">
            <div className="w-10 h-10 bg-[#d4a84b]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#d4a84b]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-semibold text-gray-900">
                {event.location || 'Location TBD'}
              </p>
              {event.isVirtual && (
                <p className="text-sm text-gray-600 mt-1">
                  Virtual meeting link will be provided upon registration
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-6 border-t border-gray-100 text-sm text-gray-600">
          {event.viewCount > 0 && <span>{event.viewCount} views</span>}
          {event.saveCount > 0 && (
            <span>{event.saveCount} people saved this</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
