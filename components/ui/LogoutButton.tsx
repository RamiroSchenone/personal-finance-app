'use client'

import { LogOut } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'

export function LogoutButton() {
  const { signOut } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const result = await signOut()
      
      if (result.error) {
        console.error('Error al cerrar sesión:', result.error)
      } else {
        console.log('Sesión cerrada exitosamente')
        // Redirigir al login después del logout
        window.location.href = '/auth/login'
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full h-12 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 flex items-center justify-center gap-3 group border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      aria-label="Cerrar sesión"
    >
      <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
      <span className="text-sm font-medium">
        {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
      </span>
    </button>
  )
} 