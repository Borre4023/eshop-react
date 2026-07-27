import { useEffect, useState } from 'react'
import { useProducts } from '@/stores/ProductsContext'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination'

export default function ProductsPage() {
  const { state, totalPages, fetchProducts, setSearchQuery, setPage } = useProducts()
  const [searchInput, setSearchInput] = useState(state.searchQuery)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    fetchProducts({ page: 1, search: searchInput })
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchQuery('')
    fetchProducts({ search: '' })
  }

  if (state.loading && !state.products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (state.error && !state.products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{state.error}</p>
          <button
            onClick={() => fetchProducts()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!state.products.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
            {state.searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Limpiar
              </button>
            )}
          </div>
        </form>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {state.searchQuery
              ? `No se encontraron productos para "${state.searchQuery}"`
              : 'No hay productos disponibles'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar
          </button>
          {state.searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        page={state.pageIndex}
        totalPages={totalPages}
        onChange={(p) => {
          setPage(p)
          fetchProducts({ page: p })
        }}
      />
    </div>
  )
}