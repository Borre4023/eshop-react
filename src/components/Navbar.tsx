import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBasket } from '@/stores/BasketContext'
import { useProducts } from '@/stores/ProductsContext'
import { useDebounce } from '@/hooks/useDebounce'

export default function Navbar() {
  const basketStore = useBasket()
  const productsStore = useProducts()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearch = useDebounce(
    useCallback(() => {
      productsStore.setSearchQuery(searchQuery)
      productsStore.fetchProducts()
      navigate('/')
    }, [searchQuery, productsStore, navigate]),
    300
  )

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            eShop
          </Link>

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  debouncedSearch()
                }}
                placeholder="Buscar productos..."
                className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {basketStore.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {basketStore.itemCount}
                </span>
              )}
              <span className="hidden sm:inline">Carrito</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
