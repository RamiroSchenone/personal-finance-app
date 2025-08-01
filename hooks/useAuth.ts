'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const supabase = createClient()

    // Obtener usuario actual
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Si el usuario se deslogueó, redirigir al login
        if (event === 'SIGNED_OUT') {
          console.log('Usuario deslogueado, redirigiendo a login')
          window.location.href = '/auth/login'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [mounted])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { error }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('SignOut error:', error)
        return { error }
      }
      
      console.log('SignOut successful')
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
} 