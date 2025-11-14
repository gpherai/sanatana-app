/**
 * Header Component
 * Application header with navigation
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils/cn'
import { env } from '@/core/config/env'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/events', label: 'Events' },
    { href: '/settings', label: 'Settings' }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🕉️</span>
              <span className="font-semibold text-lg text-foreground">
                {env.NEXT_PUBLIC_APP_NAME}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              v{env.NEXT_PUBLIC_APP_VERSION}
            </span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium whitespace-nowrap transition-colors hover:text-primary',
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
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
