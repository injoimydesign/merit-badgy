import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { SearchFilters } from './SearchFilters'
import { SearchResults } from './SearchResults'
import { SearchHeader } from './SearchHeader'
import { useQuery } from '@tanstack/react-query'
import { listEventsFn } from '@/server/functions/events'
import type { ListEventsInput } from '@/server/functions/events'

const ITEMS_PER_PAGE = 12

export function SearchPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_public/search' })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Build filter object from URL params
  const filters: ListEventsInput = {
    query: searchParams.q,
    badgeName: searchParams.badgeName,
    subjectArea: searchParams.subjectArea,
    isVirtual: searchParams.virtual === 'true' ? true : undefined,
    isEagleRequired: searchParams.eagle === 'true' ? true : undefined,
    limit: ITEMS_PER_PAGE,
    offset: ((searchParams.page || 1) - 1) * ITEMS_PER_PAGE,
  }

  // Add timeframe filter
  if (searchParams.timeframe === 'month') {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    filters.startDate = today.toISOString().split('T')[0]
    filters.endDate = nextMonth.toISOString().split('T')[0]
  } else if (searchParams.timeframe === 'week') {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    filters.startDate = today.toISOString().split('T')[0]
    filters.endDate = nextWeek.toISOString().split('T')[0]
  }

  // Fetch events
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => listEventsFn({ data: filters }),
  })

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0
  const currentPage = searchParams.page || 1

  const handleFilterChange = (newFilters: Partial<typeof searchParams>) => {
    void navigate({
      to: '/search',
      search: {
        ...searchParams,
        ...newFilters,
        page: 1, // Reset to page 1 when filters change
      },
    })
  }

  const handlePageChange = (page: number) => {
    void navigate({
      to: '/search',
      search: {
        ...searchParams,
        page,
      },
    })
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    void navigate({
      to: '/search',
      search: {},
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <SearchHeader
          searchQuery={searchParams.q || ''}
          onSearchChange={(q) => handleFilterChange({ q })}
          totalResults={data?.total || 0}
          onToggleMobileFilters={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside
              className={`
                            lg:w-80 lg:flex-shrink-0
                            ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}
                        `}
            >
              <div className="lg:sticky lg:top-24">
                <SearchFilters
                  filters={searchParams}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  resultsCount={data?.total || 0}
                />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              <SearchResults
                events={data?.events || []}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
