import axios from 'axios'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dashboard
export const getDashboard = () => apiClient.get('/dashboard')

// Sources
export const getSources = () => apiClient.get('/sources')
export const addSource = (data) => apiClient.post('/sources', data)
export const deleteSource = (sourceId) => apiClient.post(`/sources/${sourceId}/delete`)
export const scrapeSource = (sourceId) => apiClient.post(`/scrape/${sourceId}`)

// Articles
export const getArticles = () => apiClient.get('/articles')

// Email Settings
export const getEmailSettings = () => apiClient.get('/email-settings')
export const saveEmailSettings = (email) => apiClient.post('/email-settings', { email })

export default apiClient
