/**
 * Simple Logger Utility
 * Structured logging for development and production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Helper functions using process.env.NODE_ENV (safe for both client and server)
const isDevelopment = () => process.env.NODE_ENV === 'development'
const isProduction = () => process.env.NODE_ENV === 'production'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  data?: unknown
  timestamp: string
}

class Logger {
  private formatLog(entry: LogEntry): string {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`
    const context = entry.context ? `[${entry.context}]` : ''
    return `${prefix} ${context} ${entry.message}`
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString()
    }

    const formattedMessage = this.formatLog(entry)

    switch (level) {
      case 'debug':
        if (isDevelopment()) {
          console.debug(formattedMessage, data ?? '')
        }
        break
      case 'info':
        console.info(formattedMessage, data ?? '')
        break
      case 'warn':
        console.warn(formattedMessage, data ?? '')
        break
      case 'error':
        console.error(formattedMessage, data ?? '')
        if (data instanceof Error) {
          console.error(data.stack)
        }
        break
    }

    // In production, you might want to send logs to an external service
    if (isProduction() && level === 'error') {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    }
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log('debug', message, context, data)
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data)
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data)
  }

  error(message: string, context?: string, error?: unknown): void {
    this.log('error', message, context, error)
  }

  // Request logging helper
  logRequest(method: string, url: string, duration?: number): void {
    const message = duration
      ? `${method} ${url} - ${duration}ms`
      : `${method} ${url}`
    this.info(message, 'HTTP')
  }

  // Database query logging helper
  logQuery(query: string, duration?: number): void {
    if (isDevelopment()) {
      const message = duration
        ? `Query executed in ${duration}ms`
        : 'Query executed'
      this.debug(message, 'DATABASE', { query })
    }
  }
}

export const logger = new Logger()
