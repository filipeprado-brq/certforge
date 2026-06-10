import React from 'react'

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outline' | 'ghost' | 'danger' | 'danger-filled'
  size?: 'sm' | 'lg'
  arrow?: boolean
}

export const Btn = ({
  variant = 'filled',
  size,
  children,
  arrow,
  ...rest
}: BtnProps) => (
  <button
    className={`btn btn--${variant}${size ? ` btn--${size}` : ''}`}
    {...rest}
  >
    {children}
    {arrow ? (
      <span className="arrow" aria-hidden="true">
        →
      </span>
    ) : null}
  </button>
)
