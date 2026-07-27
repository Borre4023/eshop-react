import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from 'react'
import { basketApi } from '@/api/basket'
import type { ShoppingCart, CartItem, Product } from '@/types'

interface BasketState {
  cart: ShoppingCart
  loading: boolean
  error: string | null
}

type BasketAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: ShoppingCart }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_USER'; payload: string }

const initialState: BasketState = {
  cart: { userName: '', items: [] },
  loading: false,
  error: null,
}

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false }
    case 'SET_ITEMS':
      return { ...state, cart: { ...state.cart, items: action.payload } }
    case 'SET_USER':
      return { ...state, cart: { ...state.cart, userName: action.payload } }
    default:
      return state
  }
}

interface BasketContextValue {
  state: BasketState
  totalPrice: number
  itemCount: number
  isEmpty: boolean
  initCart: (userName: string) => void
  fetchBasket: () => Promise<void>
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearBasket: () => Promise<void>
}

const BasketContext = createContext<BasketContextValue | undefined>(undefined)

export function BasketProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(basketReducer, initialState)

  const totalPrice = useMemo(
    () => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cart.items]
  )

  const itemCount = useMemo(
    () => state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.cart.items]
  )

  const isEmpty = state.cart.items.length === 0

  const fetchBasket = useCallback(async () => {
    if (!state.cart.userName) return
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const response = await basketApi.getByUser(state.cart.userName)
      const data = response.data

      if (data.userName || data.items) {
        dispatch({ type: 'SET_CART', payload: data })
      } else {
        dispatch({ type: 'SET_ITEMS', payload: [] })
      }
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status === 404) {
        dispatch({ type: 'SET_ITEMS', payload: [] })
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar el carrito' })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.cart.userName])

  const initCart = useCallback(
    (userName: string) => {
      const sanitized = userName.trim().replace(/\s+/g, '_') || 'anonymous'
      dispatch({ type: 'SET_USER', payload: sanitized })
    },
    []
  )

  const saveBasket = useCallback(async (items: CartItem[]) => {
    if (!state.cart.userName) return
    try {
      await basketApi.save({
        userName: state.cart.userName,
        items,
      })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar el carrito' })
    }
  }, [state.cart.userName])

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      const existing = state.cart.items.find((i) => i.productId === product.id)
      let newItems: CartItem[]

      if (existing) {
        newItems = state.cart.items.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      } else {
        newItems = [
          ...state.cart.items,
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl || product.imageFiles || '',
          },
        ]
      }

      dispatch({ type: 'SET_ITEMS', payload: newItems })
      saveBasket(newItems)
    },
    [state.cart.items, saveBasket]
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        const newItems = state.cart.items.filter((i) => i.productId !== productId)
        dispatch({ type: 'SET_ITEMS', payload: newItems })
        saveBasket(newItems)
        return
      }

      const newItems = state.cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      dispatch({ type: 'SET_ITEMS', payload: newItems })
      saveBasket(newItems)
    },
    [state.cart.items, saveBasket]
  )

  const removeItem = useCallback(
    (productId: string) => {
      const newItems = state.cart.items.filter((i) => i.productId !== productId)
      dispatch({ type: 'SET_ITEMS', payload: newItems })
      saveBasket(newItems)
    },
    [state.cart.items, saveBasket]
  )

  const clearBasket = useCallback(async () => {
    if (!state.cart.userName) return
    try {
      await basketApi.delete(state.cart.userName)
      dispatch({ type: 'SET_ITEMS', payload: [] })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Error al limpiar el carrito' })
    }
  }, [state.cart.userName])

  const value = useMemo(
    () => ({
      state,
      totalPrice,
      itemCount,
      isEmpty,
      initCart,
      fetchBasket,
      addItem,
      updateQuantity,
      removeItem,
      clearBasket,
    }),
    [state, totalPrice, itemCount, isEmpty, initCart, fetchBasket, addItem, updateQuantity, removeItem, clearBasket]
  )

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
}

export function useBasket(): BasketContextValue {
  const context = useContext(BasketContext)
  if (!context) {
    throw new Error('useBasket debe usarse dentro de un BasketProvider')
  }
  return context
}
