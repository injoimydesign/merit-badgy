import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-[#d4a84b] font-display font-bold text-lg">
                  M
                </span>
              </div>
              <span className="font-display font-bold text-lg">
                Merit Badge Finder
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Helping Scouts and parents discover merit badge classes across the
              country.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-[#d4a84b]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Browse Classes
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  search={{ eagle: 'true' }}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Eagle Required Badges
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  search={{ virtual: 'true' }}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Virtual Classes
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-[#d4a84b]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/counselor-registration"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Become a Counselor
                </Link>
              </li>
              <li>
                <Link
                  to="/submit-event"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Submit an Event
                </Link>
              </li>
              <li>
                <a
                  href="https://www.scouting.org/programs/scouts-bsa/advancement-and-awards/merit-badges/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Official BSA Merit Badges
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-[#d4a84b]">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Merit Badge Class Finder. All rights
            reserved.
          </p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#e8927c] fill-current" />{' '}
            for Scouts everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
