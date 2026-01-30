import { useNavigate } from '@tanstack/react-router'
import { Calendar, Monitor, Award, Grid3X3 } from 'lucide-react'
import { motion } from 'motion/react'

const QUICK_FILTERS = [
  {
    id: 'this-month',
    label: 'This Month',
    icon: Calendar,
    search: { timeframe: 'month' },
    color: 'bg-[#2d5a3d]',
  },
  {
    id: 'virtual',
    label: 'Virtual Classes',
    icon: Monitor,
    search: { virtual: 'true' },
    color: 'bg-[#1e3a5f]',
  },
  {
    id: 'eagle',
    label: 'Eagle Required',
    icon: Award,
    search: { eagle: 'true' },
    color: 'bg-[#d4a84b]',
  },
  {
    id: 'all',
    label: 'Browse All',
    icon: Grid3X3,
    search: {},
    color: 'bg-[#e8927c]',
  },
] as const

export function QuickFilters() {
  const navigate = useNavigate()

  const handleFilterClick = (search: Record<string, string>) => {
    void navigate({
      to: '/search',
      search,
    })
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-3">
            Quick Search
          </h2>
          <p className="text-gray-600">
            Jump right into finding the perfect class
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_FILTERS.map((filter, index) => (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFilterClick(filter.search)}
              className={`${filter.color} relative overflow-hidden rounded-2xl p-6 text-white text-left transition-shadow hover:shadow-xl group`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

              <filter.icon className="w-8 h-8 mb-4 relative z-10" />
              <span className="text-lg font-semibold relative z-10 block">
                {filter.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
