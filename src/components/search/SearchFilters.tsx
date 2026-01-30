import { X, Calendar, Award, Monitor, Grid3X3, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface SearchFiltersProps {
  filters: {
    q?: string
    badgeName?: string
    subjectArea?: string
    virtual?: string
    eagle?: string
    timeframe?: string
  }
  onFilterChange: (filters: Partial<SearchFiltersProps['filters']>) => void
  onClearFilters: () => void
  resultsCount: number
}

const SUBJECT_AREAS = [
  'Citizenship',
  'STEM',
  'Outdoor Skills',
  'Health & Safety',
  'Arts & Hobbies',
  'Business & Communication',
  'Aquatics',
  'Nature & Conservation',
]

const POPULAR_BADGES = [
  'First Aid',
  'Camping',
  'Citizenship in the Community',
  'Swimming',
  'Personal Fitness',
  'Cooking',
  'Emergency Preparedness',
  'Environmental Science',
  'Hiking',
  'Lifesaving',
  'Personal Management',
  'Sustainability',
]

export function SearchFilters({
  filters,
  onFilterChange,
  onClearFilters,
  resultsCount,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    timeframe: true,
    type: true,
    badge: true,
    subject: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const hasActiveFilters = !!(
    filters.badgeName ||
    filters.subjectArea ||
    filters.virtual ||
    filters.eagle ||
    filters.timeframe
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-[#1e3a5f]" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-[#e8927c] hover:text-[#e8927c] hover:bg-[#e8927c]/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {/* Timeframe */}
        <FilterSection
          title="When"
          icon={Calendar}
          isExpanded={expandedSections.timeframe}
          onToggle={() => toggleSection('timeframe')}
        >
          <RadioGroup
            value={filters.timeframe || 'all'}
            onValueChange={(value) =>
              onFilterChange({ timeframe: value === 'all' ? undefined : value })
            }
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="time-all" />
                <Label
                  htmlFor="time-all"
                  className="cursor-pointer font-normal"
                >
                  Any time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="time-week" />
                <Label
                  htmlFor="time-week"
                  className="cursor-pointer font-normal"
                >
                  This week
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="time-month" />
                <Label
                  htmlFor="time-month"
                  className="cursor-pointer font-normal"
                >
                  This month
                </Label>
              </div>
            </div>
          </RadioGroup>
        </FilterSection>

        {/* Class Type */}
        <FilterSection
          title="Class Type"
          icon={Monitor}
          isExpanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="virtual"
                checked={filters.virtual === 'true'}
                onCheckedChange={(checked) =>
                  onFilterChange({ virtual: checked ? 'true' : undefined })
                }
              />
              <Label htmlFor="virtual" className="cursor-pointer font-normal">
                Virtual only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eagle"
                checked={filters.eagle === 'true'}
                onCheckedChange={(checked) =>
                  onFilterChange({ eagle: checked ? 'true' : undefined })
                }
              />
              <Label
                htmlFor="eagle"
                className="cursor-pointer font-normal flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-[#d4a84b]" />
                Eagle required
              </Label>
            </div>
          </div>
        </FilterSection>

        {/* Popular Badges */}
        <FilterSection
          title="Popular Badges"
          icon={Award}
          isExpanded={expandedSections.badge}
          onToggle={() => toggleSection('badge')}
        >
          <div className="space-y-2">
            {POPULAR_BADGES.map((badge) => (
              <button
                key={badge}
                onClick={() =>
                  onFilterChange({
                    badgeName: filters.badgeName === badge ? undefined : badge,
                  })
                }
                className={`
                                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                                    ${
                                      filters.badgeName === badge
                                        ? 'bg-[#1e3a5f] text-white font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }
                                `}
              >
                {badge}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Subject Areas */}
        <FilterSection
          title="Subject Area"
          icon={Grid3X3}
          isExpanded={expandedSections.subject}
          onToggle={() => toggleSection('subject')}
        >
          <div className="space-y-2">
            {SUBJECT_AREAS.map((area) => (
              <button
                key={area}
                onClick={() =>
                  onFilterChange({
                    subjectArea:
                      filters.subjectArea === area ? undefined : area,
                  })
                }
                className={`
                                    w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                                    ${
                                      filters.subjectArea === area
                                        ? 'bg-[#1e3a5f] text-white font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }
                                `}
              >
                {area}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Results count footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Showing{' '}
          <span className="font-semibold text-[#1e3a5f]">{resultsCount}</span>{' '}
          results
        </p>
      </div>
    </div>
  )
}

interface FilterSectionProps {
  title: string
  icon: React.ElementType
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="p-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#1e3a5f]" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
