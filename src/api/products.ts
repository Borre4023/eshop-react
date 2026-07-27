import api from './client'
import type { Product, PaginatedResult, CreateProductRequest, UpdateProductRequest } from '@/types'

export const productsApi = {
  getAll(params?: Record<string, string | number>) {
    return api.get<PaginatedResult<Product>>('/products', { params })
  },

  getById(id: string) {
    return api.get<Product>(`/products/${id}`)
  },

  create(data: CreateProductRequest) {
    return api.post<{ id: string }>('/products', data)
  },

  update(currentName: string, data: UpdateProductRequest) {
    return api.put<{ isSuccess: boolean }>(`/products/${encodeURIComponent(currentName)}`, data)
  },

  delete(name: string) {
    return api.delete<{ isSuccess: boolean }>(`/products/${encodeURIComponent(name)}`)
  },
}