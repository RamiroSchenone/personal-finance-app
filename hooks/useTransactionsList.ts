'use client'

import { useState, useEffect, useCallback } from 'react'
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

export function useTransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { user } = useAuthContext()

  const supabase = createClient()

  // Cargar transacciones solo cuando se solicite explícitamente
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
      setIsInitialized(true)
    }
  }

  // Crear nueva transacción
  const createTransaction = async (transaction: Omit<TransactionInsert, 'user_id'>) => {
    if (!user) return { error: 'Usuario no autenticado' }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
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
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating transaction:', error)
        return { error: 'Error al actualizar la transacción' }
      }

      setTransactions(prev => 
        prev.map(t => t.id === id ? data : t)
      )
      setEditingTransaction(null)
      return { data, error: null }
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

  // Memoizar las funciones para evitar recreaciones
  const memoizedLoadTransactions = useCallback(loadTransactions, [user, filters])
  const memoizedCreateTransaction = useCallback(createTransaction, [user])
  const memoizedUpdateTransaction = useCallback(updateTransaction, [])
  const memoizedDeleteTransaction = useCallback(deleteTransaction, [])
  const memoizedApplyFilters = useCallback(applyFilters, [memoizedLoadTransactions])
  const memoizedClearFilters = useCallback(clearFilters, [memoizedLoadTransactions])

  return {
    transactions,
    loading,
    error,
    filters,
    editingTransaction,
    setEditingTransaction,
    isInitialized,
    loadTransactions: memoizedLoadTransactions,
    createTransaction: memoizedCreateTransaction,
    updateTransaction: memoizedUpdateTransaction,
    deleteTransaction: memoizedDeleteTransaction,
    applyFilters: memoizedApplyFilters,
    clearFilters: memoizedClearFilters
  }
} 