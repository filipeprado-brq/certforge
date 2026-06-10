import React from 'react'
import { Domain } from '../data/domains'

interface DomainBadgeProps {
  domain: Domain
  full?: boolean
  style?: React.CSSProperties
}

export const DomainBadge = ({ domain, full = false, style }: DomainBadgeProps) => {
  const cls = domain.id === 'd5' ? 'domain-badge domain-badge--d5' : 'domain-badge'
  const bg = domain.id === 'd5' ? undefined : `var(--${domain.id})`
  return (
    <span className={cls} style={{ background: bg, ...style }}>
      {domain.code}
      <span aria-hidden="true">·</span>
      {full ? domain.name : domain.short}
    </span>
  )
}

interface WeightChipProps {
  domain: Domain
}

export const WeightChip = ({ domain }: WeightChipProps) => (
  <span className="weight-chip">{domain.weight}% of exam</span>
)
