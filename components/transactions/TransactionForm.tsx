'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

interface TransactionFormProps {
  transaction?: Transaction | null
  onSave: (transaction: Omit<TransactionInsert, 'user_id'>) => Promise<{ error: string | null }>
  onCancel: () => void
  isOpen: boolean
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

export function TransactionForm({ transaction, onSave, onCancel, isOpen }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!transaction

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        type: transaction.type
      })
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense'
      })
    }
    setError(null)
  }, [transaction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validaciones
    if (!formData.description.trim()) {
      setError('La descripción es requerida')
      setLoading(false)
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('El monto debe ser mayor a 0')
      setLoading(false)
      return
    }

    if (!formData.category) {
      setError('La categoría es requerida')
      setLoading(false)
      return
    }



    try {
      const amount = formData.type === 'expense' 
        ? -parseFloat(formData.amount) 
        : parseFloat(formData.amount)

      const result = await onSave({
        description: formData.description.trim(),
        amount,
        category: formData.category,
        type: formData.type
      })

      if (result.error) {
        setError(result.error)
      } else {
        onCancel()
      }
    } catch (err) {
      setError('Error inesperado al guardar la transacción')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Supermercado Central"
              required
            />
          </div>

          {/* Tipo y Monto */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Guardar' : 'Crear'}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 