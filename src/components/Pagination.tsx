import { useMemo } from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const visiblePages = useMemo(() => {
    const pages: number[] = []
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, page + 2)

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4)
      else start = Math.max(1, end - 4)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }, [page, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Anterior
      </button>

      {visiblePages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-2 rounded-lg border ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-100'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Siguiente
      </button>
    </div>
  )
}
