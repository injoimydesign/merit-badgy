import { useNavigate } from '@tanstack/react-router'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

const TRENDING_BADGES = [
  {
    name: 'First Aid',
    category: 'Health & Safety',
    isEagle: true,
    classCount: 12,
    image:
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=200&h=200&fit=crop',
  },
  {
    name: 'Camping',
    category: 'Outdoor Skills',
    isEagle: true,
    classCount: 18,
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop',
  },
  {
    name: 'Citizenship in the Community',
    category: 'Citizenship',
    isEagle: true,
    classCount: 8,
    image:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200&h=200&fit=crop',
  },
  {
    name: 'Swimming',
    category: 'Aquatics',
    isEagle: true,
    classCount: 15,
    image:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&h=200&fit=crop',
  },
  {
    name: 'Personal Fitness',
    category: 'Health & Safety',
    isEagle: true,
    classCount: 10,
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
  },
  {
    name: 'Cooking',
    category: 'Outdoor Skills',
    isEagle: true,
    classCount: 7,
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop',
  },
]

export function TrendingBadges() {
  const navigate = useNavigate()

  const handleBadgeClick = (badgeName: string) => {
    void navigate({
      to: '/search',
      search: { badgeName },
    })
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 text-[#d4a84b] mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Popular This Month
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Trending Merit Badges
            </h2>
          </div>
          <button
            onClick={() => navigate({ to: '/search' })}
            className="hidden sm:flex items-center gap-1 text-[#1e3a5f] font-medium hover:gap-2 transition-all"
          >
            View all badges
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRENDING_BADGES.map((badge, index) => (
            <motion.button
              key={badge.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => handleBadgeClick(badge.name)}
              className="bg-white rounded-xl p-4 flex items-center gap-4 text-left shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#d4a84b]/30 transition-all group"
            >
              <div className="relative">
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                {badge.isEagle && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#d4a84b] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">E</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#1e3a5f] transition-colors">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-500">{badge.category}</p>
                <p className="text-sm text-[#2d5a3d] font-medium mt-1">
                  {badge.classCount} classes available
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#1e3a5f] group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center sm:hidden"
        >
          <button
            onClick={() => navigate({ to: '/search' })}
            className="inline-flex items-center gap-1 text-[#1e3a5f] font-medium"
          >
            View all badges
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
