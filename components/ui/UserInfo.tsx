'use client'

import { User } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'

export function UserInfo() {
  const { user } = useAuthContext()

  if (!user) {
    return null
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.email}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Usuario activo
          </p>
        </div>
      </div>
    </div>
  )
} 