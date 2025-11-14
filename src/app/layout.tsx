import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { ToastProvider } from '@/contexts/ToastContext'
import { ToastContainer } from '@/components/ui/ToastContainer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dharma Calendar',
  description: 'A spiritual calendar for Sanatana Dharma events and lunar phases',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Initialize theme (data-attribute)
                const theme = localStorage.getItem('currentTheme') || 'spiritual-minimal';
                document.documentElement.setAttribute('data-theme', theme);
                
                // Initialize dark mode (class)
                const dark = localStorage.getItem('darkMode') === 'true' ||
                  (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  )
}
