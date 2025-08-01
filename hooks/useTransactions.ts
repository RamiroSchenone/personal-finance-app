'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthContext } from '@/contexts/AuthContext'
import { Database } from '@/types/supabase'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export interface TransactionFilters {
  category?: string
  type?: 'income' | 'expense'
  dateFrom?: string
  dateTo?: string
  search?: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const { user } = useAuthContext()

  const supabase = createClient()

  // Cargar transacciones
  const loadTransactions = async (newFilters?: TransactionFilters) => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('id', { ascending: false }) // Ordenar también por ID para transacciones del mismo día

      const currentFilters = newFilters || filters

      // Aplicar filtros
      if (currentFilters.category) {
        query = query.eq('category', currentFilters.category)
      }

      if (currentFilters.type) {
        query = query.eq('type', currentFilters.type)
      }

      if (currentFilters.dateFrom) {
        query = query.gte('date', currentFilters.dateFrom)
      }

      if (currentFilters.dateTo) {
        query = query.lte('date', currentFilters.dateTo)
      }

      if (currentFilters.search) {
        query = query.ilike('description', `%${currentFilters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading transactions:', error)
        setError('Error al cargar las transacciones')
      } else {
        setTransactions(data || [])
      }
    } catch (err) {
      console.error('Error in loadTransactions:', err)
      setError('Error inesperado al cargar las transacciones')
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva transacción
  const createTransaction = async (transaction: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { error: 'Usuario no autenticado' }

    try {
      // Calcular la fecha actual y agregar 1 día para compensar timezone
      const now = new Date()
      now.setDate(now.getDate() + 1) // Agregar 1 día
      const currentDate = now.toLocaleDateString('en-CA') // Formato YYYY-MM-DD

      console.log('Fecha que se va a guardar:', currentDate) // Debug

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          date: currentDate, // Usar la fecha actual + 1 día
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating transaction:', error)
        return { error: 'Error al crear la transacción' }
      }

      setTransactions(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error in createTransaction:', err)
      return { error: 'Error inesperado al crear la transacción' }
    }
  }

  // Actualizar transacción
  const updateTransaction = async (id: string, updates: TransactionUpdate) => {
    try {
      // Usar el endpoint API para evitar problemas de CORS
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error updating transaction:', result.error)
        return { error: result.error || 'Error al actualizar la transacción' }
      }

      setTransactions(prev =>
        prev.map(t => t.id === id ? result.data : t)
      )
      setEditingTransaction(null)
      return { data: result.data, error: null }
    } catch (err) {
      console.error('Error in updateTransaction:', err)
      return { error: 'Error inesperado al actualizar la transacción' }
    }
  }

  // Eliminar transacción
  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting transaction:', error)
        return { error: 'Error al eliminar la transacción' }
      }

      setTransactions(prev => prev.filter(t => t.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error in deleteTransaction:', err)
      return { error: 'Error inesperado al eliminar la transacción' }
    }
  }

  // Aplicar filtros
  const applyFilters = async (newFilters: TransactionFilters) => {
    setFilters(newFilters)
    await loadTransactions(newFilters)
  }

  // Limpiar filtros
  const clearFilters = async () => {
    setFilters({})
    await loadTransactions({})
  }

  // Cargar transacciones al montar el componente
  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  return {
    transactions,
    loading,
    error,
    filters,
    editingTransaction,
    setEditingTransaction,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    applyFilters,
    clearFilters
  }
} 