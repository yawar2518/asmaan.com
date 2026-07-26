import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const SOURCE_ID = 'asmaan-properties'

export default function SatelliteMap({ properties = [], center = [74.3587, 31.5204], zoom = 12, height = '100vh' }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const propertiesById = useRef({})
  const sourceReady = useRef(false)

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

    map.current.on('load', () => {
      map.current.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })

      // Invisible layer purely so Mapbox generates cluster tiles we can
      // query via querySourceFeatures — the actual visuals are rendered as
      // DOM markers below (mapboxgl.Popup needs real DOM elements for the
      // rich image/price-pin content we show).
      map.current.addLayer({
        id: 'cluster-hitbox',
        type: 'circle',
        source: SOURCE_ID,
        paint: { 'circle-opacity': 0, 'circle-radius': 1 },
      })

      sourceReady.current = true
      renderMarkers()
    })

    const renderMarkers = () => {
      if (!sourceReady.current) return
      const source = map.current.getSource(SOURCE_ID)
      if (!source) return

      const features = map.current.querySourceFeatures(SOURCE_ID)
      const seenClusters = new Set()
      const seenPoints = new Set()
      const nextMarkers = []

      features.forEach((feature) => {
        const [lng, lat] = feature.geometry.coordinates
        const props = feature.properties

        if (props.cluster) {
          if (seenClusters.has(props.cluster_id)) return
          seenClusters.add(props.cluster_id)
          nextMarkers.push(buildClusterMarker(props.cluster_id, props.point_count, [lng, lat]))
        } else {
          if (seenPoints.has(props.id)) return
          seenPoints.add(props.id)
          const property = propertiesById.current[props.id]
          if (property) nextMarkers.push(buildPropertyMarker(property, [lng, lat]))
        }
      })

      markers.current.forEach((m) => m.remove())
      markers.current = nextMarkers
    }

    const buildClusterMarker = (clusterId, pointCount, lngLat) => {
      const el = document.createElement('div')
      el.className = 'cluster-pin'
      el.style.width = `${28 + Math.min(pointCount, 40)}px`
      el.style.height = `${28 + Math.min(pointCount, 40)}px`
      el.innerText = pointCount

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        const source = map.current.getSource(SOURCE_ID)
        source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
          if (err) return
          map.current.easeTo({ center: lngLat, zoom: expansionZoom })
        })
      })

      return new mapboxgl.Marker(el).setLngLat(lngLat).addTo(map.current)
    }

    const buildPropertyMarker = (property, lngLat) => {
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

      return new mapboxgl.Marker(el).setLngLat(lngLat).setPopup(popup).addTo(map.current)
    }

    map.current.on('render', () => {
      if (map.current.isSourceLoaded(SOURCE_ID)) renderMarkers()
    })

    map.current._asmaanRenderMarkers = renderMarkers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    propertiesById.current = Object.fromEntries(properties.map((p) => [p.id, p]))

    const geojson = {
      type: 'FeatureCollection',
      features: properties
        .filter((p) => p.latitude && p.longitude)
        .map((p) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [Number(p.longitude), Number(p.latitude)] },
          properties: { id: p.id },
        })),
    }

    const applyData = () => {
      const source = map.current?.getSource(SOURCE_ID)
      if (!source) return
      source.setData(geojson)
      // setData triggers async tile rebuilding; re-render shortly after so
      // markers reflect the new clustering without waiting for user interaction.
      setTimeout(() => map.current?._asmaanRenderMarkers?.(), 50)
    }

    if (map.current?.isStyleLoaded()) {
      applyData()
    } else {
      map.current?.once('load', applyData)
    }
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
