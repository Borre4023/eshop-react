import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Bienvenido a eShop
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Explora nuestro catálogo de productos y encuentra lo que necesitas.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold"
          >
            Ver productos
          </Link>
          <Link
            to="/admin/products"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 text-lg font-semibold"
          >
            Administrar
          </Link>
        </div>
      </div>
    </div>
  )
}