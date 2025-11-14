/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from './Container'
import { logger } from '@/core/lib/logger'
import { isDevelopment } from '@/core/config/env'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught error', 'ErrorBoundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container size="md" className="py-16">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            <div className="text-6xl">⚠️</div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>

            {isDevelopment() && this.state.error && (
              <div className="w-full mt-4 p-4 bg-muted rounded-lg text-left">
                <p className="font-mono text-sm text-red-600 whitespace-pre-wrap">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-muted-foreground">
                      Stack trace
                    </summary>
                    <pre className="mt-2 font-mono text-xs text-muted-foreground overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={this.handleReset} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </div>
        </Container>
      )
    }

    return this.props.children
  }
}
