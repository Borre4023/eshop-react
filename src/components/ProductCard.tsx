import { Link } from 'react-router-dom'
import { useBasket } from '@/stores/BasketContext'
import type { Product } from '@/types'

function formatPrice(price: number) {
  return Number(price || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const basketStore = useBasket()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={product.imageFile || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png'
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex gap-1 mb-2 flex-wrap">
          {product.category?.map((cat) => (
            <span
              key={cat}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description || 'Sin descripcion'}
        </p>

        <p className="text-xl font-bold text-blue-600 mb-3">
          ${formatPrice(product.price)}
        </p>

        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Detalle
          </Link>
          <button
            onClick={() => basketStore.addItem(product)}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
