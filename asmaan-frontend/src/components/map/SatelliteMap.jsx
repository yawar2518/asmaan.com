import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function SatelliteMap({ properties = [], center = [74.3587, 31.5204], zoom = 12, height = '100vh' }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center,
      zoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left')
    map.current.addControl(
      new mapboxgl.GeolocateControl({ trackUserLocation: true }),
      'top-right'
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map.current) return

    markers.current.forEach((m) => m.remove())
    markers.current = []

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return

      const el = document.createElement('div')
      el.className = 'price-pin'
      el.innerHTML = formatPrice(property.price)

      const primaryImage = property.images?.find((img) => img.is_primary)
      const imageUrl = primaryImage?.image_url || property.images?.[0]?.image_url
      const statusLabel = STATUS_LABELS[property.status] || property.status

      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(`
        <div style="font-family: sans-serif; width: 200px;">
          ${imageUrl
            ? `<div style="width: 100%; height: 100px; border-radius: 6px; overflow: hidden; margin-bottom: 6px;">
                 <img src="${imageUrl}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
               </div>`
            : ''}
          <strong>${property.title}</strong><br/>
          <span style="color: #666;">${property.area}, ${property.city}</span><br/>
          <span>${property.bedrooms || '-'} bed · ${property.bathrooms || '-'} bath · ${property.size} marla</span><br/>
          <span style="color: ${STATUS_COLORS[property.status] || '#666'};">${statusLabel}</span>
          ${property.is_verified ? ' · <span style="color: green;">✓ Verified</span>' : ''}
        </div>
      `)

      const marker = new mapboxgl.Marker(el)
        .setLngLat([Number(property.longitude), Number(property.latitude)])
        .setPopup(popup)
        .addTo(map.current)

      markers.current.push(marker)
    })
  }, [properties])

  return <div ref={mapContainer} style={{ width: '100%', height }} />
}

const STATUS_LABELS = {
  available: 'Available',
  sold: 'Sold',
  rented: 'Rented',
}

const STATUS_COLORS = {
  available: '#16a34a',
  sold: '#dc2626',
  rented: '#d97706',
}

function formatPrice(price) {
  const n = Number(price)
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lac`
  return `Rs ${n.toLocaleString()}`
}