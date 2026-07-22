import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export const CITY_COORDS = {
  Lahore: [74.3587, 31.5204],
  Karachi: [67.0011, 24.8607],
  Islamabad: [73.0479, 33.6844],
  Rawalpindi: [73.0169, 33.5651],
  Faisalabad: [73.0791, 31.4504],
}

// The backend stores lat/lng as DecimalField(max_digits=9, decimal_places=6)
// — 6 dp is already ~11cm precision, but raw values from Mapbox (JS floats)
// carry 15+ decimal digits, which blows past that 9-digit total and gets
// rejected by the API. Round before it ever reaches form state.
const round6 = (n) => Math.round(n * 1e6) / 1e6

// Click or drag to drop a pin — used by the seller form to capture the
// exact GPS location of the property being listed.
export default function LocationPicker({ latitude, longitude, city, onChange, height = '280px' }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)

  useEffect(() => {
    if (map.current) return

    const initialCenter =
      longitude && latitude ? [Number(longitude), Number(latitude)] : CITY_COORDS[city] || CITY_COORDS.Lahore

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: initialCenter,
      zoom: latitude && longitude ? 16 : 12,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    const placeMarker = (lngLat) => {
      if (marker.current) {
        marker.current.setLngLat(lngLat)
      } else {
        marker.current = new mapboxgl.Marker({ color: '#111827', draggable: true })
          .setLngLat(lngLat)
          .addTo(map.current)
        marker.current.on('dragend', () => {
          const { lng, lat } = marker.current.getLngLat()
          onChange({ latitude: round6(lat), longitude: round6(lng) })
        })
      }
    }

    if (latitude && longitude) {
      placeMarker([Number(longitude), Number(latitude)])
    }

    map.current.on('click', (e) => {
      placeMarker(e.lngLat)
      onChange({ latitude: round6(e.lngLat.lat), longitude: round6(e.lngLat.lng) })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recenter when the seller changes their city selection (before a pin is dropped)
  useEffect(() => {
    if (!map.current || latitude || longitude) return
    const center = CITY_COORDS[city] || CITY_COORDS.Lahore
    map.current.flyTo({ center, zoom: 12 })
  }, [city, latitude, longitude])

  return (
    <div>
      <div ref={mapContainer} style={{ width: '100%', height, borderRadius: '0.75rem', overflow: 'hidden' }} />
      <p className="text-xs text-gray-400 mt-2">
        {latitude && longitude
          ? `Pin placed at ${Number(latitude).toFixed(5)}, ${Number(longitude).toFixed(5)} — drag to adjust.`
          : 'Click on the map to drop a pin at your property\'s exact location.'}
      </p>
    </div>
  )
}
