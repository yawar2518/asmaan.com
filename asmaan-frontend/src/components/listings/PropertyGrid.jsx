import PropertyCard from './PropertyCard'

export default function PropertyGrid({ properties, loading, error }) {
  if (loading) return <p style={{ padding: '16px', textAlign: 'center' }}>Loading properties...</p>
  if (error) return <p style={{ padding: '16px', color: 'red' }}>Error: {error}</p>
  if (properties.length === 0) return <p style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>No properties found.</p>

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '12px',
      padding: '12px',
    }}>
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}