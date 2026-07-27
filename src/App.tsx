import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Inicio from '@/pages/Inicio'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetail from '@/pages/ProductDetail'
import AdminProductsPage from '@/pages/AdminProductsPage'
import AdminProductFormPage from '@/pages/AdminProductFormPage'
import CartPage from '@/pages/CartPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/:name/edit" element={<AdminProductFormPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}