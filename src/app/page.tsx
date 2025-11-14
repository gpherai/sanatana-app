import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-24">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-primary">🕉️ Dharma Calendar</h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
            Your spiritual companion for tracking Sanatana Dharma events, festivals, and lunar
            phases
          </p>
        </div>

        {/* Success Message */}
        <div className="surface p-6 rounded-lg border-2 border-primary bg-calendar-today-bg">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">✨</span>
            <h2 className="text-2xl font-semibold text-primary">Setup Complete!</h2>
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-text-secondary">
            Your Dharma Calendar is ready to use. Database seeded with example events and lunar
            phases.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="surface p-4 rounded-lg">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-primary">8</div>
            <div className="text-sm text-text-muted">Event Categories</div>
          </div>
          <div className="surface p-4 rounded-lg">
            <div className="text-3xl mb-2">🌙</div>
            <div className="text-2xl font-bold text-primary">6</div>
            <div className="text-sm text-text-muted">Lunar Events (2025)</div>
          </div>
          <div className="surface p-4 rounded-lg">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm text-text-muted">Available Themes</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/calendar"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            View Calendar
          </Link>
          <Link
            href="/events/new"
            className="px-8 py-3 surface border-2 border-primary text-primary rounded-lg font-semibold hover:bg-surface-hover transition-colors"
          >
            Add Event
          </Link>
          <Link
            href="/settings"
            className="px-8 py-3 surface border border-border text-text-primary rounded-lg font-semibold hover:bg-surface-hover transition-colors"
          >
            Settings
          </Link>
        </div>

        {/* Tech Stack Info */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-text-muted mb-3">Built with modern technologies:</p>
          <div className="flex flex-wrap gap-3 justify-center text-xs">
            <span className="px-3 py-1 surface rounded-full">Next.js 15.5</span>
            <span className="px-3 py-1 surface rounded-full">React 19</span>
            <span className="px-3 py-1 surface rounded-full">Node.js 24</span>
            <span className="px-3 py-1 surface rounded-full">Prisma 6.16</span>
            <span className="px-3 py-1 surface rounded-full">Tailwind v4</span>
            <span className="px-3 py-1 surface rounded-full">TypeScript 5.7</span>
          </div>
        </div>

        {/* Development Tools */}
        <div className="text-sm text-text-muted space-y-2">
          <p>Development tools available:</p>
          <div className="flex gap-4 justify-center">
            <a
              href="http://localhost:5555"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Prisma Studio
            </a>
            <span className="text-border">|</span>
            <a
              href="https://github.com/prisma/prisma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Prisma Docs
            </a>
            <span className="text-border">|</span>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Next.js Docs
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
