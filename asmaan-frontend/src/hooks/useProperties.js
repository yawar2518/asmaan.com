import { useEffect, useState } from 'react'
import { propertyService } from '../services/api'

export function useProperties(category) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProperties() {
      try {
        setLoading(true)
        const data = await propertyService.getByCategory(category)
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
  }, [category])

  return { properties, loading, error }
}