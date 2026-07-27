import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.title ||
      error.response?.data?.detail ||
      error.message ||
      'Error de conexion con el servidor'

    console.error(`[API Error ${status}]:`, message)

    if (status === 500) {
      console.error('Error interno del servidor. Revisa Railway.')
    } else if (!status) {
      console.error('No se puede conectar con el servidor.')
    }

    return Promise.reject(error)
  }
)

export default api
