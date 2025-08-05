'use client'

import { useState, useEffect } from 'react'
import { mercadoPagoService, MercadoPagoUser, MercadoPagoPayment } from '@/services/mercadopago'

export interface MercadoPagoState {
  isConfigured: boolean
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: MercadoPagoUser | null
  payments: MercadoPagoPayment[]
  paymentsLoading: boolean
}

export function useMercadoPago() {
  const [state, setState] = useState<MercadoPagoState>({
    isConfigured: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    user: null,
    payments: [],
    paymentsLoading: false
  })

  // Inicializar estado
  useEffect(() => {
    const initializeState = async () => {
      const isConfigured = mercadoPagoService.isConfigured()
      const isAuthenticated = await mercadoPagoService.isAuthenticated()
      
      setState(prev => ({
        ...prev,
        isConfigured,
        isAuthenticated,
        isLoading: false
      }))

      // Si está autenticado, obtener información del usuario y pagos
      if (isAuthenticated) {
        loadUserInfo()
        loadPayments()
      }
    }

    initializeState()
  }, [])

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
      let errorMessage = 'Error al cargar información del usuario'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Manejar errores específicos de autorización
      if (errorMessage.includes('NO_TOKEN_FOUND')) {
        errorMessage = 'No tienes una integración activa con Mercado Pago. Debes autorizar la conexión primero.'
      } else if (errorMessage.includes('TOKEN_EXPIRED')) {
        errorMessage = 'Tu sesión de Mercado Pago ha expirado. Debes renovar la autorización.'
      } else if (errorMessage.includes('UNAUTHORIZED') || errorMessage.includes('403')) {
        errorMessage = 'Acceso denegado por políticas de Mercado Pago. Verifica que tu aplicación tenga los permisos correctos.'
      } else if (errorMessage.includes('TOKEN_INVALID') || errorMessage.includes('401')) {
        errorMessage = 'Token de acceso inválido. Debes reautenticarte con Mercado Pago.'
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false
      }))
    }
  }

  // Cargar pagos de Mercado Pago
  const loadPayments = async () => {
    try {
      setState(prev => ({ ...prev, paymentsLoading: true, error: null }))
      
      const data = await mercadoPagoService.getPayments(50, 0)
      
      setState(prev => ({
        ...prev,
        payments: data.payments || [],
        paymentsLoading: false
      }))
    } catch (error) {
      let errorMessage = 'Error al cargar pagos'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      // Manejar errores específicos de autorización
      if (errorMessage.includes('NO_TOKEN_FOUND')) {
        errorMessage = 'No tienes una integración activa con Mercado Pago. Debes autorizar la conexión primero.'
      } else if (errorMessage.includes('TOKEN_EXPIRED')) {
        errorMessage = 'Tu sesión de Mercado Pago ha expirado. Debes renovar la autorización.'
      } else if (errorMessage.includes('UNAUTHORIZED') || errorMessage.includes('403')) {
        errorMessage = 'Acceso denegado por políticas de Mercado Pago. Verifica que tu aplicación tenga los permisos correctos.'
      } else if (errorMessage.includes('TOKEN_INVALID') || errorMessage.includes('401')) {
        errorMessage = 'Token de acceso inválido. Debes reautenticarte con Mercado Pago.'
      } else if (errorMessage.includes('ENDPOINT_NOT_FOUND') || errorMessage.includes('404')) {
        errorMessage = 'El endpoint de pagos no está disponible. Verifica la configuración de la API.'
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
        paymentsLoading: false
      }))
    }
  }

  // Iniciar proceso de autenticación
  const authenticate = () => {
    try {
      setState(prev => ({ ...prev, error: null }))
      mercadoPagoService.authenticate()
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al iniciar autenticación'
      }))
    }
  }

  // Cerrar sesión
  const logout = async () => {
    await mercadoPagoService.logout()
    setState({
      isConfigured: mercadoPagoService.isConfigured(),
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      payments: [],
      paymentsLoading: false
    })
  }

  // Limpiar error
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return {
    ...state,
    authenticate,
    logout,
    clearError,
    loadPayments
  }
} 