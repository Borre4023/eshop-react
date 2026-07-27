import api from './client'
import type { Product, PaginatedResult } from '@/types'

export const productsApi = {
  getAll(params?: Record<string, string | number>) {
    return api.get<PaginatedResult<Product>>('/products', { params })
  },

  getById(id: number) {
    return api.get<Product>(`/products/${id}`)
  },

  create(product: Omit<Product, 'id'>) {
    return api.post<Product>('/products', product)
  },

  update(name: string, product: Partial<Product>) {
    return api.put<Product>(`/products/${encodeURIComponent(name)}`, product)
  },

  delete(name: string) {
    return api.delete(`/products/${encodeURIComponent(name)}`)
  },
}
