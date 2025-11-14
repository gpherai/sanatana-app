'use client'

import { useToast, Toast as ToastType } from '@/contexts/ToastContext'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

function Toast({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast()
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      // Start exit animation 300ms before removal
      const exitTimer = setTimeout(() => {
        setIsExiting(true)
      }, toast.duration - 300)

      return () => clearTimeout(exitTimer)
    }
  }, [toast.duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      removeToast(toast.id)
    }, 300)
  }

  // Icon based on type
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  }[toast.type]

  // Colors based on type
  const colorClasses = {
    success: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  }[toast.type]

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg
        ${colorClasses}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
