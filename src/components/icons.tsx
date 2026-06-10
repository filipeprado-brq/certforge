import React from 'react'

interface IconProps {
  size?: number
  strokeWidth?: number
  style?: React.CSSProperties
}

interface IconInternalProps extends IconProps {
  d: React.ReactNode
}

const Icon = ({ d, size = 16, strokeWidth = 1.6, style }: IconInternalProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    {d}
  </svg>
)

export const IconCheck = (p: IconProps) => (
  <Icon {...p} d={<path d="M2.5 8.5l3.5 3.5 7-8" />} />
)

export const IconX = (p: IconProps) => (
  <Icon {...p} d={<path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />} />
)

export const IconClock = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <g>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 4.5V8l2.5 1.5" />
      </g>
    }
  />
)

export const IconCards = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <g>
        <rect x="4.5" y="2.5" width="9" height="11" rx="2" />
        <path d="M2.5 5v7a2 2 0 0 0 2 2h6" />
      </g>
    }
  />
)

export const IconArrowR = (p: IconProps) => (
  <Icon {...p} d={<path d="M2.5 8h11M9.5 4l4 4-4 4" />} />
)

export const IconFlip = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <g>
        <path d="M13.5 6.5a6 6 0 0 0-11-2" />
        <path d="M2.5 1.5v3h3" />
        <path d="M2.5 9.5a6 6 0 0 0 11 2" />
        <path d="M13.5 14.5v-3h-3" />
      </g>
    }
  />
)

export const IconSun = (p: IconProps) => (
  <Icon
    {...p}
    d={
      <g>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4" />
      </g>
    }
  />
)

export const IconMoon = (p: IconProps) => (
  <Icon {...p} d={<path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" />} />
)
