import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-gray-500 text-lg mb-4">Pagina no encontrada</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
