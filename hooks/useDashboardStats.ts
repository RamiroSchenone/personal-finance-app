'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'
import { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']

// Colores predefinidos para las categorías
const categoryColors: Record<string, string> = {
  'Alimentación': '#3B82F6', // Azul
  'Transporte': '#8B5CF6', // Morado
  'Entretenimiento': '#06B6D4', // Cyan
  'Salud': '#10B981', // Verde
  'Educación': '#F59E0B', // Amarillo
  'Vivienda': '#EF4444', // Rojo
  'Servicios': '#F97316', // Naranja
  'Ingresos': '#84CC16', // Verde lima
  'Otros': '#6B7280' // Gris
}

export interface DashboardStats {
  currentBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  balanceChange: number
  expenseDistribution: Array<{
    name: string
    value: number
    color: string
  }>
  recentTransactions: Transaction[]
  budgetProgress: {
    totalBudget: number
    spent: number
    percentage: number
    remaining: number
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthContext()

  const supabase = createClient()

  const calculateStats = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Obtener todas las transacciones del usuario
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (transactionsError) {
        console.error('Error loading transactions:', transactionsError)
        setError('Error al cargar las estadísticas')
        return
      }

      if (!transactions) {
        setStats({
          currentBalance: 0,
          monthlyIncome: 0,
          monthlyExpenses: 0,
          balanceChange: 0,
          expenseDistribution: [],
          recentTransactions: [],
          budgetProgress: {
            totalBudget: 2000,
            spent: 0,
            percentage: 0,
            remaining: 2000
          }
        })
        return
      }

      // Calcular estadísticas del mes actual
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const lastMonth = new Date(currentYear, currentMonth - 1, 1)

      const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear
      })

      const lastMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= lastMonth && transactionDate < new Date(currentYear, currentMonth, 1)
      })

      // Calcular ingresos y gastos del mes actual
      const monthlyIncome = currentMonthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)

      const monthlyExpenses = Math.abs(currentMonthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0))

      // También calcular el saldo total de todas las transacciones
      const totalIncome = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = Math.abs(transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0))

      // Usar el saldo total acumulado (más útil para el usuario)
      const currentBalance = totalIncome - totalExpenses



      // Calcular cambio respecto al mes anterior
      const lastMonthIncome = lastMonthTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)

      const lastMonthExpenses = Math.abs(lastMonthTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0))

      const lastMonthBalance = lastMonthIncome - lastMonthExpenses
      
      // Calcular cambio basado en el saldo del mes actual vs mes anterior
      const monthlyBalance = monthlyIncome - monthlyExpenses
      const balanceChange = lastMonthBalance !== 0 
        ? ((monthlyBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100 
        : 0

             // Calcular distribución de gastos del mes actual
       const expenseCategories = currentMonthTransactions
         .filter(t => t.amount < 0)
         .reduce((acc, t) => {
           acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
           return acc
         }, {} as Record<string, number>)

       const expenseDistribution = Object.entries(expenseCategories)
         .map(([category, amount]) => ({
           name: category,
           value: amount,
           color: categoryColors[category as keyof typeof categoryColors] || '#6B7280'
         }))
         .sort((a, b) => b.value - a.value)

       

      // Obtener transacciones recientes (últimas 5) - ya están ordenadas por fecha descendente
      const recentTransactions = transactions.slice(0, 5)

                          // Calcular progreso del presupuesto basado en ingresos totales (más útil para el usuario)
        const totalBudget = totalIncome // El presupuesto es igual a los ingresos totales
        const spent = totalExpenses
        const percentage = totalBudget > 0 ? (spent / totalBudget) * 100 : 0
        const remaining = totalBudget - spent

      setStats({
        currentBalance,
        monthlyIncome,
        monthlyExpenses,
        balanceChange,
        expenseDistribution,
        recentTransactions,
        budgetProgress: {
          totalBudget,
          spent,
          percentage: Math.min(percentage, 100),
          remaining: Math.max(remaining, 0)
        }
      })

    } catch (err) {
      console.error('Error calculating stats:', err)
      setError('Error inesperado al calcular las estadísticas')
    } finally {
      setLoading(false)
    }
  }

  // Solo cargar cuando se solicite explícitamente
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (user && !isInitialized) {
      calculateStats()
      setIsInitialized(true)
    }
  }, [user, isInitialized])

  // Memoizar la función para evitar recreaciones
  const memoizedCalculateStats = useCallback(calculateStats, [user])

  return {
    stats,
    loading,
    error,
    refreshStats: memoizedCalculateStats
  }
} 