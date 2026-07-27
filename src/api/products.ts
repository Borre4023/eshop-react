import api from './client'
import type { Product, PaginatedResult, CreateProductRequest, UpdateProductRequest } from '@/types'

export const productsApi = {
  getAll(params?: Record<string, string | number>) {
    return api.get<PaginatedResult<Product>>('/api/products', { params })
  },

  getById(id: string) {
    return api.get<Product>(`/api/products/${id}`)
  },

  create(data: CreateProductRequest) {
    return api.post<{ id: string }>('/api/products', data)
  },

  update(currentName: string, data: UpdateProductRequest) {
    return api.put<{ isSuccess: boolean }>(`/api/products/${encodeURIComponent(currentName)}`, data)
  },

  delete(name: string) {
    return api.delete<{ isSuccess: boolean }>(`/api/products/${encodeURIComponent(name)}`)
  },
}