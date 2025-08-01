'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      console.log('Usuario no autenticado, redirigiendo a login')
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Mostrar loading mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (será redirigido)
  if (!user) {
    return null
  }

  // Si hay usuario, renderizar el contenido protegido
  return <>{children}</>
} 