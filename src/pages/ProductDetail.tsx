import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProducts } from '@/stores/ProductsContext'
import { useBasket } from '@/stores/BasketContext'

function formatPrice(price: number) {
  return Number(price || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { state, fetchProductById } = useProducts()
  const basketStore = useBasket()

  useEffect(() => {
    if (id) fetchProductById(Number(id))
  }, [id, fetchProductById])

  if (state.loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-96 bg-gray-200" />
          <div className="p-6 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (state.error || !state.currentProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            {state.error || 'Producto no encontrado'}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    )
  }

  const product = state.currentProduct

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-96 bg-gray-200">
            <img
              src={product.imageFile || '/placeholder.png'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png'
              }}
            />
          </div>

          <div className="p-6 md:w-1/2">
            <div className="flex gap-1 mb-4 flex-wrap">
              {product.category?.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <p className="text-gray-600 mb-6">
              {product.description || 'Sin descripcion'}
            </p>

            {product.availableStock !== undefined && (
              <p className="text-sm text-gray-500 mb-4">
                Stock disponible: {product.availableStock}
              </p>
            )}

            <p className="text-3xl font-bold text-blue-600 mb-6">
              ${formatPrice(product.price)}
            </p>

            <button
              onClick={() => basketStore.addItem(product)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
