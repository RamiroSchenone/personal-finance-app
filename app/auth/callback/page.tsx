'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          router.push('/auth/login')
          return
        }

        if (data.session) {
          // Usuario autenticado, redirigir al dashboard
          router.push('/')
        } else {
          // No hay sesión, redirigir al login
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
      </div>
    </div>
  )
} 