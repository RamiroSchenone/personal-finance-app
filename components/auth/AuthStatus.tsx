'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, User } from 'lucide-react'

export function AuthStatus() {
  const { user, loading, signOut } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600 dark:text-gray-400">Cargando...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">No autenticado</Badge>
        <Button size="sm" variant="outline" asChild className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
          <a href="/auth/login">Iniciar Sesión</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.email}
        </span>
        <Badge variant="default">Autenticado</Badge>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => signOut()}
        className="flex items-center gap-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <LogOut className="w-3 h-3" />
        Cerrar Sesión
      </Button>
    </div>
  )
} 