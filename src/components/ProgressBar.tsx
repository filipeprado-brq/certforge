interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  label?: string
}

export const ProgressBar = ({ value, color, height = 4, label }: ProgressBarProps) => (
  <div
    className="progress"
    style={{ height }}
    role="progressbar"
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label || 'progress'}
  >
    <span
      style={{ width: `${value}%`, background: color || 'var(--fill)' }}
    ></span>
  </div>
)
