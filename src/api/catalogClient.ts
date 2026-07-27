import axios from 'axios'

const CATALOG_URL = import.meta.env.VITE_CATALOG_URL || 'http://localhost:5201'

const catalogApi = axios.create({
  baseURL: CATALOG_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

catalogApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.title ||
      error.response?.data?.detail ||
      error.message ||
      'Error de conexion con Catalog API'

    console.error(`[Catalog API Error ${status}]:`, message)
    return Promise.reject(error)
  }
)

export default catalogApi
