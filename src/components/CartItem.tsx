import type { CartItem as CartItemType } from '@/types'

function formatPrice(price: number) {
  return Number(price || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <img
        src={item.imageUrl || '/placeholder.png'}
        alt={item.productName}
        className="w-16 h-16 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.productName}</h3>
        <p className="text-gray-500 text-sm">${formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          className="w-8 h-8 rounded border hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
          className="w-8 h-8 rounded border hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <p className="font-semibold w-24 text-right">
        ${formatPrice(item.price * item.quantity)}
      </p>

      <button
        onClick={() => onRemove(item.productId)}
        className="text-red-500 hover:text-red-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
