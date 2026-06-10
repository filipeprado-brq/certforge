import { EmptyState } from '../components/EmptyState'

interface PlaceholderProps {
  title: string
}

export const Placeholder = ({ title }: PlaceholderProps) => (
  <div>
    <div className="page-head">
      <p className="t-mono page-kicker">{title}</p>
      <h1 className="t-display page-title">{title}</h1>
    </div>
    <EmptyState
      title="Coming soon"
      body="This area arrives in a later phase. Navigation already works end-to-end — full functionality is on the way."
    />
  </div>
)
