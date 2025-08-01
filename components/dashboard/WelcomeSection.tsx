'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { Calendar, Clock } from 'lucide-react'

export function WelcomeSection() {
  const { user } = useAuthContext()
  const currentDate = new Date()
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserName = () => {
    if (!user) return 'Usuario'
    return user.email?.split('@')[0] || 'Usuario'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Hola, {getUserName()}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Aquí tienes un resumen de tus finanzas
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(currentDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(currentDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 