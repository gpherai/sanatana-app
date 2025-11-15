/**
 * Root Layout
 * Main layout for the application
 */

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Header } from '@/shared/components/layout/Header'
import { ErrorBoundary } from '@/shared/components/layout/ErrorBoundary'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { ThemeProvider } from '@/features/themes/context/ThemeContext'
import { env } from '@/core/config/env'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'Hindu calendar for tracking Sanatana Dharma events, festivals, and lunar phases',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
