import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { productsApi } from '@/api/products'
import type { Product } from '@/types'

interface FormData {
  name: string
  description: string
  price: string
  category: string[]
  imageFiles: string
  imageUrl: string
}

interface FormErrors {
  name?: string
  description?: string
  price?: string
  category?: string
  imageFiles?: string
}

export default function AdminProductFormPage() {
  const { name: productName } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isEdit = !!productName

  const locationProduct = (location.state as { product?: Product })?.product

  const [form, setForm] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: [],
    imageFiles: '',
    imageUrl: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(isEdit && !locationProduct)
  const [saving, setSaving] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [categoryInput, setCategoryInput] = useState('')

  useEffect(() => {
    if (!isEdit || locationProduct) return

    async function loadProduct() {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await productsApi.getAll({ name: productName! })
        const product = res.data.data.find((p) => p.name === productName)
        if (!product) {
          setFetchError('Producto no encontrado')
          return
        }
        setForm({
          name: product.name,
          description: product.descripcion,
          price: String(product.price),
          category: product.category,
          imageFiles: product.imageFiles,
          imageUrl: product.imageUrl || '',
        })
      } catch {
        setFetchError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [isEdit, productName, locationProduct])

  useEffect(() => {
    if (isEdit && locationProduct) {
      setForm({
        name: locationProduct.name,
        description: locationProduct.descripcion,
        price: String(locationProduct.price),
        category: locationProduct.category,
        imageFiles: locationProduct.imageFiles,
        imageUrl: locationProduct.imageUrl || '',
      })
    }
  }, [isEdit, locationProduct])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleAddCategory() {
    const trimmed = categoryInput.trim()
    if (!trimmed) return
    if (form.category.includes(trimmed)) return
    setForm((prev) => ({ ...prev, category: [...prev.category, trimmed] }))
    setCategoryInput('')
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }))
    }
  }

  function handleRemoveCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      category: prev.category.filter((c) => c !== cat),
    }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!form.description.trim()) newErrors.description = 'La descripción es requerida'
    if (!form.price.trim()) {
      newErrors.price = 'El precio es requerido'
    } else if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0'
    }
    if (form.category.length === 0) newErrors.category = 'Agrega al menos una categoría'
    if (!form.imageFiles.trim()) newErrors.imageFiles = 'Las imágenes son requeridas'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setSubmitError(null)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        imagesFiles: form.imageFiles.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
      }
      if (isEdit) {
        await productsApi.update(productName!, payload)
      } else {
        await productsApi.create(payload)
      }
      navigate('/admin/products')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { title?: string } } })?.response?.data?.title ||
        'Error al guardar el producto'
      setSubmitError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 text-lg mb-4">{fetchError}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a productos
          </button>
        </div>
      </div>
    )
  }

  const inputClass = (hasError?: string) =>
    `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            &larr; Volver
          </button>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass(errors.name)}
              placeholder="Nombre del producto"
              disabled={saving}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass(errors.description)} h-24 resize-none`}
              placeholder="Descripción del producto"
              disabled={saving}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass(errors.price)}
              placeholder="0.00"
              step="0.01"
              min="0"
              disabled={saving}
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Categorías <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                className={inputClass(errors.category)}
                placeholder="Escribe una categoría y presiona Agregar"
                disabled={saving}
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 shrink-0"
                disabled={saving}
              >
                Agregar
              </button>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
            {form.category.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mt-2">
                {form.category.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-blue-600 hover:text-blue-800 font-bold leading-none"
                      disabled={saving}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Image Files <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="imageFiles"
              value={form.imageFiles}
              onChange={handleChange}
              className={inputClass(errors.imageFiles)}
              placeholder="URL de la imagen"
              disabled={saving}
            />
            {errors.imageFiles && (
              <p className="mt-1 text-sm text-red-500">{errors.imageFiles}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Image URL <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="URL alternativa de la imagen"
              disabled={saving}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Guardando...' : isEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
