import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---- Auth token handling -------------------------------------------------

const ACCESS_KEY = 'asmaan_access_token'
const REFRESH_KEY = 'asmaan_refresh_token'

export const tokenStorage = {
  get: () => ({
    access: localStorage.getItem(ACCESS_KEY),
    refresh: localStorage.getItem(REFRESH_KEY),
  }),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

api.interceptors.request.use((config) => {
  const { access } = tokenStorage.get()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { refresh } = tokenStorage.get()

    if (
      error.response?.status === 401 &&
      refresh &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      originalRequest._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/refresh/`, { refresh })
            .finally(() => {
              refreshPromise = null
            })
        }
        const { data } = await refreshPromise
        tokenStorage.set({ access: data.access })
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (refreshError) {
        tokenStorage.clear()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// ---- Domain services ------------------------------------------------------

export const propertyService = {
  // filters uses the same snake_case keys as the REST query params themselves
  // (min_price, max_price, bedrooms, min_area, max_area, city, zone) so the
  // FilterBar's state can be passed straight through.
  getByCategory: async (category, filters = {}) => {
    const params = { category }
    if (filters.min_price) params.min_price = filters.min_price
    if (filters.max_price) params.max_price = filters.max_price
    if (filters.bedrooms && filters.bedrooms !== 'Any') {
      params.bedrooms = parseInt(filters.bedrooms, 10) // "5+" -> 5 (backend treats bedrooms as a minimum)
    }
    if (filters.min_area) params.min_area = filters.min_area
    if (filters.max_area) params.max_area = filters.max_area
    if (filters.city && filters.city !== 'Any') params.city = filters.city
    if (filters.zone) params.zone = filters.zone

    const response = await api.get('/properties/', { params })
    return response.data.results
  },

  getById: async (id) => {
    const response = await api.get(`/properties/${id}/`)
    return response.data
  },

  updateStatus: async (id, statusValue) => {
    const response = await api.patch(`/properties/${id}/`, { status: statusValue })
    return response.data
  },

  listAll: async (params = {}) => {
    const response = await api.get('/properties/', { params })
    return response.data.results
  },
}

export const listingService = {
  submit: async (payload) => {
    const response = await api.post('/listings/', payload)
    return response.data
  },

  uploadPhoto: async (listingId, file, caption = '') => {
    const formData = new FormData()
    formData.append('image', file)
    if (caption) formData.append('caption', caption)
    const response = await api.post(`/listings/${listingId}/photos/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  track: async (token) => {
    const response = await api.get(`/listings/track/${token}/`)
    return response.data
  },

  list: async (params = {}) => {
    const response = await api.get('/listings/', { params })
    return response.data.results
  },

  get: async (id) => {
    const response = await api.get(`/listings/${id}/`)
    return response.data
  },

  assignAgent: async (id, agentId) => {
    const response = await api.patch(`/listings/${id}/assign-agent/`, { agent_id: agentId })
    return response.data
  },

  startVisit: async (id) => {
    const response = await api.patch(`/listings/${id}/start-visit/`)
    return response.data
  },

  completeVisit: async (id, visitNotes) => {
    const response = await api.patch(`/listings/${id}/complete-visit/`, { visit_notes: visitNotes })
    return response.data
  },

  setAdminNotes: async (id, adminNotes) => {
    const response = await api.patch(`/listings/${id}/admin-notes/`, { admin_notes: adminNotes })
    return response.data
  },

  approve: async (id) => {
    const response = await api.post(`/listings/${id}/approve/`)
    return response.data
  },

  reject: async (id, adminNotes) => {
    const response = await api.post(`/listings/${id}/reject/`, { admin_notes: adminNotes })
    return response.data
  },

  bulkAction: async (ids, action, adminNotes = '') => {
    const response = await api.post('/listings/bulk-action/', { ids, action, admin_notes: adminNotes })
    return response.data
  },
}

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password })
    return response.data
  },

  me: async () => {
    const response = await api.get('/auth/me/')
    return response.data
  },
}

export default api

export const getPropertyById = propertyService.getById
