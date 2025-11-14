/**
 * Toast Context
 * Global toast notification system
 */

'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastNotification } from '@/shared/types'
import { ToastContainer } from '@/shared/components/ui/ToastContainer'

interface ToastContextValue {
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  showSuccess: (message: string, duration?: number) => void
  showError: (message: string, duration?: number) => void
  showWarning: (message: string, duration?: number) => void
  showInfo: (message: string, duration?: number) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast({ type: 'success', message, duration })
  }, [showToast])

  const showError = useCallback((message: string, duration?: number) => {
    showToast({ type: 'error', message, duration })
  }, [showToast])

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast({ type: 'warning', message, duration })
  }, [showToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast({ type: 'info', message, duration })
  }, [showToast])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        dismissToast
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
