import api from './client'
import type { ShoppingCart } from '@/types'

export const basketApi = {
  getByUser(userName: string) {
    return api.get<ShoppingCart>(`/basket/${encodeURIComponent(userName)}`)
  },

  save(basket: ShoppingCart) {
    return api.post('/basket', { cart: basket })
  },

  delete(userName: string) {
    return api.delete(`/basket/${encodeURIComponent(userName)}`)
  },
}
