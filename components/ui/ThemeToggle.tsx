'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeContext } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { isDark, toggleTheme, mounted } = useThemeContext()

  if (!mounted) {
    return (
      <div className="w-full h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full h-12 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-3 group border border-gray-200 dark:border-gray-700 cursor-pointer"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-gray-600 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</span>
        </>
      )}
    </button>
  )
} 