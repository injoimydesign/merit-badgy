import { createFileRoute } from '@tanstack/react-router'
import {
  Navbar,
  Hero,
  QuickFilters,
  TrendingBadges,
  FeaturedEvents,
  Footer,
} from '@/components/landing'

export const Route = createFileRoute('/_public/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <QuickFilters />
        <TrendingBadges />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  )
}
