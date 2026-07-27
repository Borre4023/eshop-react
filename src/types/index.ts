export interface Product {
  id: string
  name: string
  descripcion: string
  price: number
  category: string[]
  imageFiles: string
  imageUrl?: string
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
}

export interface ShoppingCart {
  userName: string
  items: CartItem[]
}

export interface PaginatedResult<T> {
  data: T[]
  count: number
  pageIndex: number
  pageSize: number
}

export interface CreateProductRequest {
  name: string
  description: string
  category: string[]
  imagesFiles: string
  price: number
  imageUrl?: string
}

export interface UpdateProductRequest {
  name: string
  description: string
  category: string[]
  imagesFiles: string
  price: number
  imageUrl?: string
}