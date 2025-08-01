'use client'

import { DollarSign } from 'lucide-react'
import { DashboardStats } from '@/hooks/useDashboardStats'

interface BudgetProgressProps {
  stats: DashboardStats
}

// Componente para el progress ring
function ProgressRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference

  // Determinar el color basado en el porcentaje
  const getGradientColors = () => {
    if (percentage >= 100) {
      return {
        start: '#ef4444',
        middle: '#dc2626', 
        end: '#b91c1c'
      }
    } else if (percentage >= 80) {
      return {
        start: '#f59e0b',
        middle: '#d97706',
        end: '#b45309'
      }
    } else {
      return {
        start: '#8b5cf6',
        middle: '#6366f1',
        end: '#3b82f6'
      }
    }
  }

  const colors = getGradientColors()

  return (
    <div className="relative flex items-center justify-center group">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.middle} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          filter="url(#glow)"
          style={{
            animation: "progressAnimation 2s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold transition-colors duration-300 group-hover:text-blue-600 ${
          percentage >= 100 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
        }`}>
          {percentage >= 100 ? '100%+' : `${percentage.toFixed(0)}%`}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {percentage >= 100 ? 'Excedido' : 'Gastado'}
        </span>
      </div>
    </div>
  )
}

export function BudgetProgress({ stats }: BudgetProgressProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const hasIncome = stats.budgetProgress.totalBudget > 0
  const isOverBudget = stats.budgetProgress.remaining < 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Presupuesto Mensual</h3>
      
             {!hasIncome ? (
         <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
           <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
             <DollarSign className="w-8 h-8 text-gray-400" />
           </div>
           <p className="text-sm text-center">No hay ingresos registrados</p>
           <p className="text-xs text-gray-400 mt-1 text-center">Agrega transacciones de ingreso para establecer tu presupuesto</p>
         </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <ProgressRing percentage={stats.budgetProgress.percentage} />
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {formatCurrency(stats.budgetProgress.spent)} de {formatCurrency(stats.budgetProgress.totalBudget)}
            </p>
            <p className={`text-xs mt-2 ${
              isOverBudget 
                ? 'text-red-600 dark:text-red-400 font-medium' 
                : 'text-gray-500 dark:text-gray-500'
            }`}>
              {isOverBudget 
                ? `Excedido por ${formatCurrency(Math.abs(stats.budgetProgress.remaining))}`
                : `Quedan ${formatCurrency(stats.budgetProgress.remaining)} disponibles`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 