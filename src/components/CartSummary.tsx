import { Link } from 'react-router-dom'

function formatPrice(price: number) {
  return Number(price || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface CartSummaryProps {
  totalPrice: number
  onClear: () => void
}

export default function CartSummary({ totalPrice, onClear }: CartSummaryProps) {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-2xl font-bold text-blue-600">
          ${formatPrice(totalPrice)}
        </span>
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          to="/"
          className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200"
        >
          Seguir comprando
        </Link>
        <button
          onClick={onClear}
          className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  )
}
