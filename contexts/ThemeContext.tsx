'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Obtener tema guardado o preferencia del sistema
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    
    // Aplicar tema inmediatamente
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      console.log('Tema aplicado: dark')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Tema aplicado: light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    console.log('Cambiando tema a:', newTheme ? 'dark' : 'light')

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
} 