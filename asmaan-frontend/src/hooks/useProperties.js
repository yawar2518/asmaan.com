import { useEffect, useState } from 'react'
import { propertyService } from '../services/api'

export function useProperties(category, filters = {}) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { minPrice, maxPrice } = filters

  useEffect(() => {
    let cancelled = false

    async function fetchProperties() {
      try {
        setLoading(true)
        const data = await propertyService.getByCategory(category, { minPrice, maxPrice })
        if (!cancelled) {
          setProperties(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setProperties([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProperties()
    return () => { cancelled = true }
  }, [category, minPrice, maxPrice])

  return { properties, loading, error }
}