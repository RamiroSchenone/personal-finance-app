'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" />
      )}
    </button>
  )
} 