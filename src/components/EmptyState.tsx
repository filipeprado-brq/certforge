import React from 'react'

interface EmptyStateProps {
  title: string
  body: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, body, action }: EmptyStateProps) => (
  <div className="empty-state">
    <div className="glyph" aria-hidden="true">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M22 4l14 8v16l-14 8-14-8V12z" />
        <path d="M8 12l14 8 14-8M22 20v16" />
      </svg>
    </div>
    <h3 className="t-display" style={{ fontSize: 24, margin: 0 }}>
      {title}
    </h3>
    <p
      className="t-muted"
      style={{
        fontSize: 15,
        fontWeight: 300,
        lineHeight: 1.5,
        maxWidth: '44ch',
        margin: '10px auto 0',
      }}
    >
      {body}
    </p>
    {action ? (
      <div
        style={{
          marginTop: 'var(--space-5)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {action}
      </div>
    ) : null}
  </div>
)
