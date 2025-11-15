/**
 * Header Component
 * Application header with navigation
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/cn'
import { env } from '@/core/config/env.client'
import { useTheme } from '@/features/themes/context/ThemeContext'

export function Header() {
  const pathname = usePathname()
  const { isDark, toggleDarkMode } = useTheme()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/settings', label: 'Settings' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/95 backdrop-blur-md shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">
                🕉️
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-primary">
                  {env.NEXT_PUBLIC_APP_NAME}
                </span>
                <span className="text-xs text-muted-foreground">
                  Sanatana Dharma Calendar
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift',
                    isActive(item.href)
                      ? 'bg-primary/15 text-foreground border-2 border-primary shadow-soft font-bold'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 border-2 border-transparent'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Switch */}
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isDark ? 'bg-primary' : 'bg-muted'
              }`}
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-white shadow-md transition-transform ${
                  isDark ? 'translate-x-9' : 'translate-x-1'
                }`}
              >
                <span className="text-base">
                  {isDark ? '🌙' : '☀️'}
                </span>
              </span>
            </button>

            <span className="hidden sm:inline-flex text-xs text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">
              v{env.NEXT_PUBLIC_APP_VERSION}
            </span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-2 pb-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 hover-lift',
                isActive(item.href)
                  ? 'bg-primary/15 text-foreground border-2 border-primary shadow-soft font-bold'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/50 border-2 border-transparent'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
