import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, Menu, X, User, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { motion, AnimatePresence } from 'motion/react'

export function Navbar() {
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      void navigate({
        to: '/search',
        search: { q: searchQuery.trim() },
      })
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <span className="text-[#d4a84b] font-display font-bold text-lg">
                M
              </span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              Merit Badge Finder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/search"
              className="text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Browse Classes
            </Link>
            <Link
              to="/search"
              search={{ eagle: 'true' }}
              className="text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Eagle Required
            </Link>
            <Link
              to="/search"
              search={{ virtual: 'true' }}
              className="text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors"
            >
              Virtual Classes
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth buttons */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    void navigate({ to: '/example-protected-route' })
                  }
                  className="text-gray-600"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void signOut()}
                  className="border-gray-200"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void navigate({ to: '/sign-in' })}
                  className="text-gray-600"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => void navigate({ to: '/sign-up' })}
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a merit badge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Browse Classes
              </Link>
              <Link
                to="/search"
                search={{ eagle: 'true' }}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Eagle Required
              </Link>
              <Link
                to="/search"
                search={{ virtual: 'true' }}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                Virtual Classes
              </Link>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {currentUser ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        void navigate({ to: '/example-protected-route' })
                        setMobileMenuOpen(false)
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-600"
                      onClick={() => {
                        void signOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        void navigate({ to: '/sign-in' })
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white"
                      onClick={() => {
                        void navigate({ to: '/sign-up' })
                        setMobileMenuOpen(false)
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
