import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import PropertyDetailCard from '../components/property/PropertyDetailCard'
import { getPropertyById } from '../services/api'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPropertyById(id)
      .then((data) => setProperty(data))
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {/* Image skeleton */}
            <div className="w-full h-56 bg-gray-200 rounded-xl animate-pulse" />
            {/* Card skeleton */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/buy')}
              className="text-sm font-medium text-gray-900 underline"
            >
              Back to listings
            </button>
          </div>
        )}

        {/* Property images */}
        {property && !loading && (
          <>
            {property.images?.length > 0 ? (
              <div className="mb-4">
                {/* Main image */}
                <div className="w-full h-56 rounded-xl overflow-hidden mb-2">
                  <img
                    src={property.images[0].image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnail strip */}
                {property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {property.images.slice(1).map((img, i) => (
                      <div key={i} className="shrink-0 w-20 h-16 rounded-lg overflow-hidden">
                        <img
                          src={img.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* No image placeholder */
              <div className="w-full h-56 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                <div className="text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5z" />
                  </svg>
                  <p className="text-xs text-gray-300">No photos yet</p>
                </div>
              </div>
            )}

            {/* Detail card */}
            <PropertyDetailCard property={property} />
          </>
        )}

      </div>
    </div>
  )
}