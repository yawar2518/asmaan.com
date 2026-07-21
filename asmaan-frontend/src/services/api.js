import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const propertyService = {
  getByCategory: async (category, filters = {}) => {
    const params = { category }
    if (filters.minPrice != null) params.min_price = filters.minPrice
    if (filters.maxPrice != null) params.max_price = filters.maxPrice

    const response = await api.get('/properties/', { params })
    return response.data.results
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}/`)
    return response.data
  },
}

export default api

export const getPropertyById = async (id) => {
  const response = await axios.get(`/api/properties/${id}/`)
  return response.data
}