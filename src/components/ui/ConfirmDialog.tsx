'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { FocusTrap } from 'focus-trap-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  // Variant styling
  const variantStyles = {
    danger: {
      icon: 'bg-red-500/10 text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      border: 'border-red-500/30',
    },
    warning: {
      icon: 'bg-yellow-500/10 text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      border: 'border-yellow-500/30',
    },
    info: {
      icon: 'bg-blue-500/10 text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      border: 'border-blue-500/30',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          initialFocus: false,
          clickOutsideDeactivates: true,
          returnFocusOnDeactivate: false,
          allowOutsideClick: true,
        }}
      >
        <div
          className={`relative surface rounded-lg shadow-xl max-w-md w-full mx-4 border ${styles.border}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 id="confirm-dialog-title" className="text-xl font-semibold text-text-primary">
              {title}
            </h2>
            <button
              onClick={onCancel}
              className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p id="confirm-dialog-description" className="text-text-primary leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-border">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-border bg-surface text-text-primary font-medium hover:bg-surface-hover transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${styles.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}
