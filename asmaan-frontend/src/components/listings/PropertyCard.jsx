import { Link } from 'react-router-dom'
import VerifiedBadge from '../common/VerifiedBadge'

export default function PropertyCard({ property }) {
  const primaryImage = property.images?.find(img => img.is_primary)
  const imageUrl = primaryImage?.image_url || property.images?.[0]?.image_url

  return (
    <Link to={`/property/${property.id}`} style={{
      display: 'block',
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{
        height: '160px',
        background: imageUrl ? `url(${imageUrl}) center/cover` : '#e5e7eb',
        position: 'relative',
      }}>
        {property.is_verified && (
          <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
            <VerifiedBadge />
          </div>
        )}
      </div>

      <div style={{ padding: '12px' }}>
        <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 4px', color: '#1f2937' }}>
          {formatPrice(property.price)}
        </p>

        <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px', fontWeight: '500' }}>
          {property.title}
        </p>

        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
          {property.bedrooms != null && <span>{property.bedrooms} bed</span>}
          {property.bathrooms != null && <span>{property.bathrooms} bath</span>}
          <span>{property.size} marla</span>
        </div>

        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
          📍 {property.area}, {property.city}
        </p>
      </div>
    </Link>
  )
}

function formatPrice(price) {
  const n = Number(price)
  if (n >= 10000000) return `Rs ${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `Rs ${(n / 100000).toFixed(1)} Lac`
  return `Rs ${n.toLocaleString()}`
}