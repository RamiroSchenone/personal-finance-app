'use client'

import { useState, useEffect } from 'react'
import { mercadoPagoService, MercadoPagoUser } from '@/services/mercadopago'
import { useAuthContext } from '@/contexts/AuthContext'

export interface MercadoPagoState {
  isConfigured: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: MercadoPagoUser | null
  movements: any[]
  movementsLoading: boolean
}

export function useMercadoPago() {
  const { user } = useAuthContext()
  const [state, setState] = useState<MercadoPagoState>({
    isConfigured: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    user: null,
    movements: [],
    movementsLoading: false
  })

  // Inicializar estado
  useEffect(() => {
    const initializeState = async () => {
      console.log('Inicializando estado de Mercado Pago:', { userId: user?.id })
      
      const isConfigured = mercadoPagoService.isConfigured()
      const isAuthenticated = user ? await mercadoPagoService.isAuthenticated(user.id) : false
      
      console.log('Estado inicial:', { isConfigured, isAuthenticated })
      
      setState(prev => ({
        ...prev,
        isConfigured,
        isAuthenticated,
        isLoading: false
      }))

      // Si está autenticado, obtener información del usuario y movimientos
      if (isAuthenticated) {
        loadUserInfo()
        loadMovements()
      }
    }

    initializeState()

    // Listener para detectar cuando el usuario regresa de la autorización
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === 'MERCADOPAGO_AUTH_SUCCESS') {
        const { code } = event.data
        processCallback(code)
      } else if (event.data.type === 'MERCADOPAGO_AUTH_ERROR') {
        setState(prev => ({
          ...prev,
          error: event.data.error || 'Error en la autorización'
        }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [user])

  // Cargar información del usuario
  const loadUserInfo = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const user = await mercadoPagoService.getUserInfo()
      
      setState(prev => ({
        ...prev,
        user,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cargar información del usuario',
        isLoading: false
      }))
    }
  }

  // Cargar movimientos de Mercado Pago
  const loadMovements = async () => {
    try {
      setState(prev => ({ ...prev, movementsLoading: true, error: null }))
      
      const data = await mercadoPagoService.getMovements(50, 0)
      
      setState(prev => ({
        ...prev,
        movements: data.movements || [],
        movementsLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cargar movimientos',
        movementsLoading: false
      }))
    }
  }

  // Iniciar proceso de autenticación
  const authenticate = () => {
    try {
      const authUrl = mercadoPagoService.getAuthorizationUrl()
      window.open(authUrl, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes')
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar autenticación'
      }))
    }
  }

  // Procesar callback de autorización
  const processCallback = async (code: string) => {
    if (!user) {
      setState(prev => ({
        ...prev,
        error: 'Usuario no autenticado',
        isLoading: false
      }))
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      await mercadoPagoService.exchangeCodeForToken(code, user.id)
      
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false
      }))

      // Cargar información del usuario
      await loadUserInfo()
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al procesar autorización',
        isLoading: false
      }))
    }
  }

  // Cerrar sesión
  const logout = async () => {
    await mercadoPagoService.logout(user?.id)
    setState({
      isConfigured: mercadoPagoService.isConfigured(),
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null
    })
  }

  // Limpiar error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return {
    ...state,
    authenticate,
    processCallback,
    logout,
    clearError,
    loadMovements
  }
} 