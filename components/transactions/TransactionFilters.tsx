'use client'

import { useState } from 'react'
import { Filter, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionFilters } from '@/hooks/useTransactions'

interface TransactionFiltersProps {
  filters: TransactionFilters
  onApplyFilters: (filters: TransactionFilters) => void
  onClearFilters: () => void
}

const categories = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Vivienda',
  'Servicios',
  'Ingresos',
  'Otros'
]

export function TransactionFilters({ filters, onApplyFilters, onClearFilters }: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters)

  const handleApply = () => {
    onApplyFilters(localFilters)
    setIsOpen(false)
  }

  const handleClear = () => {
    setLocalFilters({})
    onClearFilters()
    setIsOpen(false)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filtrar
        {hasActiveFilters && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en descripciones..."
                  value={localFilters.search || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <select
                value={localFilters.type || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' | '' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Fecha desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Desde
              </label>
              <input
                type="date"
                value={localFilters.dateFrom || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Fecha hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hasta
              </label>
              <input
                type="date"
                value={localFilters.dateTo || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleApply}
              className="flex-1"
            >
              Aplicar Filtros
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
            >
              Limpiar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 