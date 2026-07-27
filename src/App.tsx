import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import HomePage from '@/pages/HomePage'
import ProductDetail from '@/pages/ProductDetail'
import CartPage from '@/pages/CartPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}
