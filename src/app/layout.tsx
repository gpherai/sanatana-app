/**
 * Root Layout
 * Main layout for the application
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/shared/components/layout/Header'
import { ErrorBoundary } from '@/shared/components/layout/ErrorBoundary'
import { ToastProvider } from '@/shared/contexts/ToastContext'
import { env } from '@/core/config/env'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
  description: 'Hindu calendar for tracking Sanatana Dharma events, festivals, and lunar phases',
  version: env.NEXT_PUBLIC_APP_VERSION
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Header />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
