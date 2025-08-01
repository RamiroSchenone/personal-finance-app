'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useThemeContext } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signIn, signUp } = useAuthContext()
  const { isDark } = useThemeContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Forzar re-render cuando cambie el tema
  useEffect(() => {
    console.log('LoginForm - Tema actual:', isDark ? 'dark' : 'light')
  }, [isDark])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)
      
      if (result.error) {
        setError(result.error.message || 'Error en la autenticación')
      } else {
        // Éxito - el usuario será redirigido automáticamente
        console.log('Autenticación exitosa:', result.data)
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error)
      setError('Error inesperado. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="w-96 h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Partículas de fondo animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-300 rounded-full animate-bounce opacity-10"></div>
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping opacity-25"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 dark:border-gray-700/20">
        {/* Header con gradiente animado */}
        <div className="mb-8 text-center">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl p-6 mb-6 overflow-hidden group">
            {/* Efecto de brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            <div className="relative">
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">FinanceApp</h1>
              <p className="text-blue-100 text-sm animate-fade-in-delay">
                {isSignUp ? 'Únete a nosotros' : 'Bienvenido de vuelta'}
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-fade-in-delay-2">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm animate-fade-in-delay-3">
            {isSignUp 
              ? 'Crea una nueva cuenta para comenzar a gestionar tus finanzas'
              : 'Ingresa tus credenciales para acceder a tu dashboard'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-delay-4">
          <div className="space-y-2 group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-600/70 focus:bg-white dark:focus:bg-gray-700 cursor-text"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="space-y-2 group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all duration-300 hover:bg-gray-100/70 dark:hover:bg-gray-600/70 focus:bg-white dark:focus:bg-gray-700 cursor-text"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50/80 dark:bg-red-900/20 p-4 rounded-xl border border-red-200/50 dark:border-red-800/50 animate-shake">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {error}
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative overflow-hidden group"
          >
            {/* Efecto de brillo en el botón */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative">
              {isLoading 
                ? (isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...') 
                : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')
              }
            </span>
          </Button>
          
          <div className="pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              {isSignUp 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'
              }
            </button>
          </div>
        </form>
        
        {/* Footer con información adicional */}
        <div className="mt-8 text-center animate-fade-in-delay-5">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isSignUp 
              ? 'Al crear una cuenta, aceptas nuestros términos y condiciones'
              : '¿Olvidaste tu contraseña? Contacta soporte'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 