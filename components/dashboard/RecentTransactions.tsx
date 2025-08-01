'use client'

import { CreditCard } from 'lucide-react'
import { DashboardStats } from '@/hooks/useDashboardStats'
import { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface RecentTransactionsProps {
  stats: DashboardStats
}

export function RecentTransactions({ stats }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(Math.abs(amount))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (stats.recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Transacciones Recientes</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No hay transacciones recientes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Transacciones Recientes</h3>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {stats.recentTransactions.length}/5
        </span>
      </div>
      <div className="space-y-3 min-h-[300px]">
        {stats.recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full transition-transform duration-200 group-hover:scale-125 ${
                  transaction.amount > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold text-sm ${
                  transaction.amount > 0 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {transaction.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 