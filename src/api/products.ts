import catalogApi from './catalogClient'
import type { Product, PaginatedResult, CreateProductRequest, UpdateProductRequest } from '@/types'

export const productsApi = {
  getAll(params?: Record<string, string | number>) {
    return catalogApi.get<PaginatedResult<Product>>('/products', { params })
  },

  getById(id: string) {
    return catalogApi.get<Product>(`/products/${id}`)
  },

  create(data: CreateProductRequest) {
    return catalogApi.post<{ id: string }>('/products', data)
  },

  update(currentName: string, data: UpdateProductRequest) {
    return catalogApi.put<{ isSuccess: boolean }>(`/products/${encodeURIComponent(currentName)}`, data)
  },

  delete(name: string) {
    return catalogApi.delete<{ isSuccess: boolean }>(`/products/${encodeURIComponent(name)}`)
  },
}