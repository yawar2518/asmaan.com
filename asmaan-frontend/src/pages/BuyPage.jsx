import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import SatelliteMap from '../components/map/SatelliteMap'
import PropertyGrid from '../components/listings/PropertyGrid'
import ViewToggle from '../components/ui/ViewToggle'
import FilterBar, { DEFAULT_FILTERS } from '../components/ui/FilterBar'
import { useProperties } from '../hooks/useProperties'

export default function BuyPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { properties, loading, error } = useProperties('buy', filters)
  const [view, setViewState] = useState(() => sessionStorage.getItem('asmaan_view_buy') || 'grid')
  const setView = (v) => {
    setViewState(v)
    sessionStorage.setItem('asmaan_view_buy', v)
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
          {/* Header row */}
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
              {loading ? 'Loading...' : `${properties.length} properties for sale`}
            </p>
            <ViewToggle view={view} setView={setView} />
          </div>

          {/* Filter bar */}
          <FilterBar filters={filters} setFilters={setFilters} />

          {/* Grid — only shown in grid view */}
          {view === 'grid' && (
            <PropertyGrid properties={properties} loading={loading} error={error} />
          )}
        </div>

        {/* Map — always mounted, hidden in grid view to avoid remount */}
        <div style={{ flex: 1, position: 'relative', display: view === 'map' ? 'block' : 'none' }}>
          <SatelliteMap properties={properties} />
        </div>
      </div>
    </div>
  )
}
