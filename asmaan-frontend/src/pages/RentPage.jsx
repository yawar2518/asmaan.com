import { useState, useMemo } from 'react'
import Navbar from '../components/common/Navbar'
import SatelliteMap from '../components/map/SatelliteMap'
import PropertyGrid from '../components/listings/PropertyGrid'
import ViewToggle from '../components/ui/ViewToggle'
import FilterBar from '../components/ui/FilterBar'
import { useProperties } from '../hooks/useProperties'

export default function RentPage() {
  const { properties, loading, error } = useProperties('rent')
  const [view, setView] = useState('grid')
  const [filters, setFilters] = useState({ bedrooms: 'Any', min_area: '', max_area: '' })

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.bedrooms !== 'Any' && String(p.bedrooms) !== filters.bedrooms) return false
      if (filters.min_area && p.area_sqft < Number(filters.min_area)) return false
      if (filters.max_area && p.area_sqft > Number(filters.max_area)) return false
      return true
    })
  }, [properties, filters])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', marginTop: '60px', overflow: 'hidden' }}>
        <div style={{
          width: '380px',
          overflowY: 'auto',
          background: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '10px 12px',
            borderBottom: '1px solid #e5e7eb',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>
              {loading ? 'Loading...' : `${filtered.length} properties for rent`}
            </p>
            <ViewToggle view={view} setView={setView} />
          </div>

          <FilterBar filters={filters} setFilters={setFilters} />

          {view === 'grid' && (
            <PropertyGrid properties={filtered} loading={loading} error={error} />
          )}
        </div>

        <div style={{ flex: 1, position: 'relative', display: view === 'map' ? 'block' : 'none' }}>
          <SatelliteMap properties={filtered} />
        </div>
      </div>
    </div>
  )
}