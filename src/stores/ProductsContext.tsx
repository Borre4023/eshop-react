import { createContext, useContext, useReducer, useMemo, useCallback, type ReactNode } from 'react'
import { productsApi } from '@/api/products'
import type { Product } from '@/types'

interface ProductsState {
  products: Product[]
  totalCount: number
  pageIndex: number
  pageSize: number
  searchQuery: string
  currentProduct: Product | null
  loading: boolean
  error: string | null
}

type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { products: Product[]; totalCount: number; pageIndex: number } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'FETCH_PRODUCT_SUCCESS'; payload: Product }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_PAGE'; payload: number }

const initialState: ProductsState = {
  products: [],
  totalCount: 0,
  pageIndex: 1,
  pageSize: 10,
  searchQuery: '',
  currentProduct: null,
  loading: false,
  error: null,
}

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        totalCount: action.payload.totalCount,
        pageIndex: action.payload.pageIndex,
      }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload, products: [] }
    case 'FETCH_PRODUCT_SUCCESS':
      return { ...state, loading: false, currentProduct: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload, pageIndex: 1 }
    case 'SET_PAGE':
      return { ...state, pageIndex: action.payload }
    default:
      return state
  }
}

interface ProductsContextValue {
  state: ProductsState
  totalPages: number
  hasProducts: boolean
  isLoading: boolean
  fetchProducts: () => Promise<void>
  fetchProductById: (id: string) => Promise<void>
  setSearchQuery: (query: string) => void
  setPage: (page: number) => void
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState)

  const totalPages = useMemo(
    () => Math.ceil(state.totalCount / state.pageSize) || 1,
    [state.totalCount, state.pageSize]
  )

  const hasProducts = state.products.length > 0
  const isLoading = state.loading

  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const params: Record<string, string | number> = {
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
      }
      if (state.searchQuery.trim()) {
        params.name = state.searchQuery.trim()
      }

      const response = await productsApi.getAll(params)
      const result = response.data

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          products: result.data || [],
          totalCount: result.count || 0,
          pageIndex: result.pageIndex || 1,
        },
      })
    } catch (err) {
      const message =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ||
        'Error al cargar productos'
      dispatch({ type: 'FETCH_ERROR', payload: message })
    }
  }, [state.pageIndex, state.pageSize, state.searchQuery])

  const fetchProductById = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_START' })
    try {
      const response = await productsApi.getById(id)
      dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: response.data })
    } catch (err) {
      const is404 = (err as { response?: { status?: number } })?.response?.status === 404
      dispatch({
        type: 'FETCH_ERROR',
        payload: is404 ? 'Producto no encontrado' : 'Error al cargar el producto',
      })
    }
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
  }, [])

  const setPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch({ type: 'SET_PAGE', payload: page })
    }
  }, [totalPages])

  const value = useMemo(
    () => ({
      state,
      totalPages,
      hasProducts,
      isLoading,
      fetchProducts,
      fetchProductById,
      setSearchQuery,
      setPage,
    }),
    [state, totalPages, hasProducts, isLoading, fetchProducts, fetchProductById, setSearchQuery, setPage]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts(): ProductsContextValue {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts debe usarse dentro de un ProductsProvider')
  }
  return context
}