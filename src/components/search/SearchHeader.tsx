import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalResults: number
  onToggleMobileFilters: () => void
}

export function SearchHeader({
  searchQuery,
  onSearchChange,
  totalResults,
  onToggleMobileFilters,
}: SearchHeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localQuery)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">
              Find Merit Badge Classes
            </h1>
            <p className="text-gray-600 mt-1">
              {totalResults > 0 ? (
                <>
                  <span className="font-semibold text-[#1e3a5f]">
                    {totalResults}
                  </span>{' '}
                  classes found
                </>
              ) : (
                'Search for classes near you'
              )}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            onClick={onToggleMobileFilters}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by merit badge name..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </form>
      </div>
    </div>
  )
}
