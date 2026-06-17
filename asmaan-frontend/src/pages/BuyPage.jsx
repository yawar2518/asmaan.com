import Navbar from '../components/common/Navbar'
import SatelliteMap from '../components/map/SatelliteMap'
import PropertyGrid from '../components/listings/PropertyGrid'
import { useProperties } from '../hooks/useProperties'

export default function BuyPage() {
  const { properties, loading, error } = useProperties('buy')

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', marginTop: '60px', overflow: 'hidden' }}>
        <div style={{
          width: '380px',
          overflowY: 'auto',
          background: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
        }}>
          <div style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
            <p style={{ margin: 0, fontWeight: '600' }}>
              {loading ? 'Loading...' : `${properties.length} properties for sale`}
            </p>
          </div>
          <PropertyGrid properties={properties} loading={loading} error={error} />
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <SatelliteMap properties={properties} />
        </div>
      </div>
    </div>
  )
}