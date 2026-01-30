import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, MapPin, Calendar, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'

const BADGE_SUGGESTIONS = [
  'Camping',
  'First Aid',
  'Citizenship in the Community',
  'Swimming',
  'Personal Fitness',
  'Cooking',
  'Emergency Preparedness',
  'Environmental Science',
]

export function Hero() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = BADGE_SUGGESTIONS.filter((badge) =>
    badge.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    void navigate({
      to: '/search',
      search: { q: searchQuery },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void navigate({
        to: '/search',
        search: { q: searchQuery },
      })
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (badge: string) => {
    setSearchQuery(badge)
    void navigate({
      to: '/search',
      search: { q: badge },
    })
    setShowSuggestions(false)
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient and texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#d4a84b] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2d5a3d] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a84b] rounded-full blur-3xl opacity-20" />
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-[#d4a84b]" />
            <span>Discover 100+ Merit Badge Classes</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 tracking-tight text-balance"
        >
          Find Merit Badge Classes
          <span className="block text-[#d4a84b]">Near You</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Instantly discover every class—local or virtual. The easiest way for
          Scouts and parents to find upcoming opportunities.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearch}>
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a merit badge..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    onKeyDown={handleKeyDown}
                    className="w-full pl-12 pr-4 py-5 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
                <div className="pr-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-8 py-6 text-base font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Autocomplete suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {filteredSuggestions.slice(0, 5).map((badge, index) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => handleSuggestionClick(badge)}
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span>{badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#d4a84b]" />
            <span>Local & Virtual Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#d4a84b]" />
            <span>Updated Weekly</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4a84b]" />
            <span>Eagle Required Badges</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
