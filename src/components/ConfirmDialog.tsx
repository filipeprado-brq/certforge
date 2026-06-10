import { useEffect } from 'react'
import { Btn } from './Btn'

interface ConfirmDialogProps {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  body,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="dialog-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
      >
        <h3 className="t-display" style={{ fontSize: 26, margin: 0 }}>
          {title}
        </h3>
        <p
          className="t-muted"
          style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.55, margin: '12px 0 0' }}
        >
          {body}
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            marginTop: 'var(--space-6)',
          }}
        >
          <Btn variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Btn>
          <Btn
            variant={danger ? 'danger-filled' : 'filled'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  )
}
