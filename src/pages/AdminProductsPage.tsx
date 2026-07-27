import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '@/api/products'
import type { Product } from '@/types'
import ConfirmDialog from '@/components/ConfirmDialog'
import Pagination from '@/components/Pagination'

function formatPrice(price: number) {
  return Number(price || 0).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, string | number> = {
        pageIndex,
        pageSize,
      }
      if (searchQuery.trim()) {
        params.name = searchQuery.trim()
      }
      const res = await productsApi.getAll(params)
      setProducts(res.data.data)
      setTotalCount(res.data.count)
    } catch (err) {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setPageIndex(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    try {
      await productsApi.delete(deleteTarget.name)
      setDeleteTarget(null)
      fetchProducts()
    } catch {
      setError('Error al eliminar el producto')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administrar Productos</h1>
        <Link
          to="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nuevo Producto
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2 max-w-md">
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
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `No se encontraron productos para "${searchQuery}"`
              : 'No hay productos'}
          </p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Precio</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Categorías</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">${formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {product.category.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link
                          to={`/admin/products/${encodeURIComponent(product.name)}/edit`}
                          state={{ product }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={pageIndex}
            totalPages={totalPages}
            onChange={(p) => setPageIndex(p)}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar producto"
        message={`¿Estás seguro de eliminar "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}