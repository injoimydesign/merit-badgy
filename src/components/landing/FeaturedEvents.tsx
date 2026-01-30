import { useNavigate } from '@tanstack/react-router'
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Bookmark,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

// Sample featured events - in production, these would come from the database
const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'First Aid Merit Badge Workshop',
    badgeName: 'First Aid',
    date: 'Saturday, Feb 15, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'Scout Camp Thunderbird',
    isVirtual: false,
    isEagle: true,
    spotsLeft: 8,
    image:
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    title: 'Virtual Citizenship in the Community',
    badgeName: 'Citizenship in the Community',
    date: 'Sunday, Feb 16, 2025',
    time: '1:00 PM - 5:00 PM',
    location: 'Online via Zoom',
    isVirtual: true,
    isEagle: true,
    spotsLeft: 15,
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    title: 'Camping Skills Weekend',
    badgeName: 'Camping',
    date: 'Feb 22-23, 2025',
    time: 'All Day',
    location: 'Pine Valley Scout Reservation',
    isVirtual: false,
    isEagle: true,
    spotsLeft: 4,
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=250&fit=crop',
  },
]

export function FeaturedEvents() {
  const navigate = useNavigate()

  const handleEventClick = (eventId: string) => {
    void navigate({
      to: '/event/$eventId',
      params: { eventId },
    })
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2">
              Upcoming Classes
            </h2>
            <p className="text-gray-600">
              Don't miss these popular upcoming opportunities
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/search' })}
            className="hidden sm:flex items-center gap-1 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white"
          >
            View all events
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_EVENTS.map((event, index) => (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => handleEventClick(event.id)}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {event.isEagle && (
                    <span className="px-2 py-1 bg-[#d4a84b] text-white text-xs font-semibold rounded-full">
                      Eagle Required
                    </span>
                  )}
                  {event.isVirtual && (
                    <span className="px-2 py-1 bg-[#1e3a5f] text-white text-xs font-semibold rounded-full">
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
                  <span className="text-white font-medium text-sm">
                    {event.badgeName}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-[#1e3a5f] transition-colors line-clamp-2">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#d4a84b]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4a84b]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#d4a84b]" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {/* Spots left indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span
                      className={`text-sm font-medium ${event.spotsLeft <= 5 ? 'text-[#e8927c]' : 'text-[#2d5a3d]'}`}
                    >
                      {event.spotsLeft} spots left
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/search' })}
            className="border-[#1e3a5f] text-[#1e3a5f]"
          >
            View all events
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
