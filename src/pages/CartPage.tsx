import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useBasket } from '@/stores/BasketContext'
import CartItem from '@/components/CartItem'
import CartSummary from '@/components/CartSummary'

export default function CartPage() {
  const basketStore = useBasket()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    if (!basketStore.state.cart.userName) {
      const name = prompt('Ingresa tu nombre de usuario:') || 'anonymous'
      basketStore.initCart(name)
    } else {
      basketStore.fetchBasket()
    }
  }, [])

  if (basketStore.isEmpty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tu Carrito</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Tu carrito esta vacio</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Ver productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tu Carrito</h1>

      <div className="space-y-4">
        {basketStore.state.cart.items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onUpdateQuantity={basketStore.updateQuantity}
            onRemove={basketStore.removeItem}
          />
        ))}
      </div>

      <CartSummary totalPrice={basketStore.totalPrice} onClear={basketStore.clearBasket} />
    </div>
  )
}
