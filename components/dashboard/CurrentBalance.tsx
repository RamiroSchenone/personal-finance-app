'use client'

import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { DashboardStats } from '@/hooks/useDashboardStats'

interface CurrentBalanceProps {
  stats: DashboardStats
}

export function CurrentBalance({ stats }: CurrentBalanceProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }



  const isNegative = stats.currentBalance < 0
  const isOverBudget = stats.budgetProgress.remaining < 0

  return (
    <div className={`relative rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
      isNegative 
        ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white' 
        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white'
    }`}>
      {/* Alerta de saldo negativo */}
      {isNegative && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          ¡CRÍTICO!
        </div>
      )}

      {/* Alerta de presupuesto excedido */}
      {isOverBudget && !isNegative && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          ¡EXCEDIDO!
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-6 h-6" />
        <h3 className="text-xl font-semibold">Saldo Actual</h3>
      </div>
      
      <p className={`text-5xl font-bold mb-3 ${isNegative ? 'text-red-200' : ''}`}>
        {formatCurrency(stats.currentBalance)}
      </p>
      
      <p className={`flex items-center gap-2 ${
        isNegative ? 'text-red-200' : 'text-blue-100'
      }`}>
        {stats.balanceChange >= 0 ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        {stats.balanceChange >= 0 ? '+' : ''}{stats.balanceChange.toFixed(1)}% desde el mes pasado
      </p>

      {/* Mensaje explicativo para saldo negativo */}
      {isNegative && (
        <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
          <p className="text-sm font-medium text-red-200">
            ⚠️ Has gastado más de lo que has ingresado este mes. 
            Considera revisar tus gastos o buscar fuentes de ingreso adicionales.
          </p>
        </div>
      )}

      {/* Mensaje explicativo para presupuesto excedido */}
      {isOverBudget && !isNegative && (
        <div className="mt-4 p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
          <p className="text-sm font-medium text-orange-200">
            ⚠️ Has excedido tu presupuesto mensual. 
            Considera reducir gastos en las próximas semanas.
          </p>
        </div>
      )}
    </div>
  )
} 