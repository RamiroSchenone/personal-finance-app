'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Database } from '@/types/supabase'
import DashboardLayout from '@/app/layout-dashboard'

type Transaction = Database['public']['Tables']['transactions']['Row']

export default function TransactionsPage() {
  const {
    transactions,
    loading,
    error,
    filters,
    editingTransaction,
    setEditingTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    applyFilters,
    clearFilters
  } = useTransactions()

  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreateTransaction = async (transaction: any) => {
    const result = await createTransaction(transaction)
    if (!result.error) {
      setShowForm(false)
    }
    return result
  }

  const handleUpdateTransaction = async (transaction: any) => {
    if (!editingTransaction) return { error: 'No hay transacción para editar' }
    const result = await updateTransaction(editingTransaction.id, transaction)
    return result
  }

  const handleDeleteTransaction = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      setDeletingId(id)
      const result = await deleteTransaction(id)
      setDeletingId(null)
      return result
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(Math.abs(amount))
    
    return {
      text: `${isPositive ? '+' : ''}${formatted}`,
      color: isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentación': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'Transporte': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Entretenimiento': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Salud': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Educación': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Vivienda': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Servicios': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      'Ingresos': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Otros': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
    return colors[category] || colors['Otros']
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando transacciones...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Todas las Transacciones</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {transactions.length} transacción{transactions.length !== 1 ? 'es' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <TransactionFilters
              filters={filters}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />
            
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Transacción
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tabla de transacciones */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No hay transacciones
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Comienza agregando tu primera transacción
                        </p>
                        <Button onClick={() => setShowForm(true)} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Nueva Transacción
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => {
                    const amountInfo = formatAmount(transaction.amount)
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getCategoryColor(transaction.category)}>
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={amountInfo.color}>
                            {amountInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingTransaction(transaction)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              disabled={deletingId === transaction.id}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                              title="Eliminar"
                            >
                              {deletingId === transaction.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario de transacción */}
        <TransactionForm
          transaction={editingTransaction}
          onSave={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          onCancel={() => {
            setShowForm(false)
            setEditingTransaction(null)
          }}
          isOpen={showForm || !!editingTransaction}
        />
      </div>
    </DashboardLayout>
  )
} 