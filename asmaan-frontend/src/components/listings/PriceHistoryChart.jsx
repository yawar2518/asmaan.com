export default function PriceHistoryChart({ history = [] }) {
  if (history.length < 2) {
    return <p style={{ fontSize: '13px', color: '#6b7280' }}>Not enough price history to show a trend yet.</p>
  }

  // API returns newest-first (model default ordering); chart reads left-to-right chronologically.
  const points = [...history].reverse()

  const width = 320
  const height = 120
  const padding = 24

  const prices = points.map((p) => Number(p.price))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const range = maxPrice - minPrice || 1

  const coords = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2)
    const y = height - padding - ((Number(p.price) - minPrice) / range) * (height - padding * 2)
    return { x, y, price: p.price, date: p.recorded_at }
  })

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ')

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={polylinePoints} fill="none" stroke="#2563eb" strokeWidth="2" />
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="3" fill="#2563eb">
          <title>{formatPrice(c.price)} on {new Date(c.date).toLocaleDateString()}</title>
        </circle>
      ))}
    </svg>
  )
}

function formatPrice(price) {
  const n = Number(price)
  if (n >= 10000000) return `Rs ${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `Rs ${(n / 100000).toFixed(1)} Lac`
  return `Rs ${n.toLocaleString()}`
}
