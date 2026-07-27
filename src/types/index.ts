export interface Product {
  id: number
  name: string
  description?: string
  price: number
  imageFile?: string
  category?: string[]
  availableStock?: number
}

export interface CartItem {
  productId: number
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
  totalCount: number
  pageIndex: number
  pageSize: number
}
