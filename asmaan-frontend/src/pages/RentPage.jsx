import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import SatelliteMap from '../components/map/SatelliteMap'
import PropertyGrid from '../components/listings/PropertyGrid'
import ViewToggle from '../components/ui/ViewToggle'
import FilterBar, { DEFAULT_FILTERS } from '../components/ui/FilterBar'
import { useProperties } from '../hooks/useProperties'

export default function RentPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { properties, loading, error } = useProperties('rent', filters)
  const [view, setViewState] = useState(() => sessionStorage.getItem('asmaan_view_rent') || 'grid')
  const setView = (v) => {
    setViewState(v)
    sessionStorage.setItem('asmaan_view_rent', v)
  }

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
              {loading ? 'Loading...' : `${properties.length} properties for rent`}
            </p>
            <ViewToggle view={view} setView={setView} />
          </div>

          <FilterBar filters={filters} setFilters={setFilters} />

          {view === 'grid' && (
            <PropertyGrid properties={properties} loading={loading} error={error} />
          )}
        </div>

        <div style={{ flex: 1, position: 'relative', display: view === 'map' ? 'block' : 'none' }}>
          <SatelliteMap properties={properties} />
        </div>
      </div>
    </div>
  )
}
