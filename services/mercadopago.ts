// Servicio para integración con Mercado Pago
export interface MercadoPagoConfig {
  accessToken: string
  clientId: string
  clientSecret: string
}

export interface MercadoPagoAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  user_id: number
  refresh_token: string
}

export interface MercadoPagoToken {
  id: string
  user_id: string
  access_token: string
  refresh_token: string | null
  token_type: string
  expires_in: number
  scope: string
  user_id_mp: number
  created_at: string
  updated_at: string
  expires_at: string
}

export interface MercadoPagoUser {
  id: number
  nickname: string
  email: string
  first_name: string
  last_name: string
}

class MercadoPagoService {
  private config: MercadoPagoConfig | null = null
  private authToken: string | null = null
  private supabase: any = null

  constructor() {
    this.initializeConfig()
    this.initializeSupabase()
  }

  private initializeSupabase() {
    // Importar dinámicamente para evitar problemas de SSR
    if (typeof window !== 'undefined') {
      import('@/lib/supabase/client').then(({ createClient }) => {
        this.supabase = createClient()
      })
    }
  }

  private initializeConfig() {
    // Solo necesitamos CLIENT_ID y CLIENT_SECRET para OAuth2
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.warn('MercadoPago: Configuración incompleta')
      return
    }

    this.config = {
      accessToken: '', // No necesitamos access token global
      clientId,
      clientSecret
    }
  }

  // Obtener URL de autorización para conectar cuenta de Mercado Pago
  getAuthorizationUrl(): string {
    if (!this.config) {
      throw new Error('MercadoPago: Configuración no disponible')
    }

    // Usar URL de callback configurable o fallback a la actual
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const redirectUri = `${baseUrl}/integrations/mercadopago/callback`
    const scope = 'read write'
    
    console.log('=== URL DE AUTORIZACIÓN ===')
    console.log('Base URL:', baseUrl)
    console.log('Redirect URI:', redirectUri)
    console.log('URL completa:', `https://auth.mercadopago.com.ar/authorization?client_id=${this.config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`)
    
    return `https://auth.mercadopago.com.ar/authorization?client_id=${this.config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`
  }

  // Intercambiar código de autorización por token de acceso
  async exchangeCodeForToken(code: string, userId: string): Promise<MercadoPagoAuthResponse> {
    console.log('=== EXCHANGE CODE FOR TOKEN ===')
    console.log('Código:', code)
    console.log('UserId:', userId)
    
    const requestBody = JSON.stringify({ code })
    console.log('Request body:', requestBody)
    
    const response = await fetch('/api/mercadopago/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      const error = JSON.parse(errorText)
      throw new Error(error.error || 'Error al obtener token')
    }

    const result = await response.json()
    console.log('Response result:', result)
    
    // Simular la respuesta de Mercado Pago para compatibilidad
    const mockResponse = {
      access_token: 'mock_token', // No necesitamos el token real en el cliente
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read write',
      user_id: 0,
      refresh_token: 'mock_refresh'
    }
    
    this.authToken = mockResponse.access_token
    return mockResponse
  }



  // Obtener información del usuario autenticado
  async getUserInfo(): Promise<MercadoPagoUser> {
    const response = await fetch('/api/mercadopago/user')

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener información del usuario')
    }

    return await response.json()
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(userId?: string): Promise<boolean> {
    if (this.authToken) return true
    
    if (!userId) return false

    try {
      console.log('Verificando autenticación para usuario:', userId)
      const response = await fetch('/api/mercadopago/user')
      const isOk = response.ok
      console.log('Verificación de autenticación:', { userId, isOk })
      
      if (isOk) {
        const userData = await response.json()
        console.log('Usuario de Mercado Pago:', userData)
      }
      
      return isOk
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      return false
    }
  }



  // Obtener token de acceso
  getAuthToken(): string | null {
    return this.authToken
  }

  // Cerrar sesión
  async logout(userId?: string): Promise<void> {
    this.authToken = null
    
    try {
      await fetch('/api/mercadopago/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error eliminando token:', error)
    }
  }

  // Verificar si la configuración está disponible
  isConfigured(): boolean {
    return this.config !== null
  }

  // Obtener movimientos de Mercado Pago
  async getMovements(limit: number = 50, offset: number = 0): Promise<any> {
    try {
      console.log('=== OBTENIENDO MOVIMIENTOS ===')
      console.log('Limit:', limit, 'Offset:', offset)
      let response = await fetch(`/api/mercadopago/movements?limit=${limit}&offset=${offset}`)
      if (response.status === 401) {
        // Intentar refresh automático
        const refreshRes = await fetch('/api/mercadopago/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ grant_type: 'refresh_token' })
        })
        if (refreshRes.ok) {
          // Reintentar la request
          response = await fetch(`/api/mercadopago/movements?limit=${limit}&offset=${offset}`)
        } else {
          throw new Error('Token expirado. Reautenticación requerida.')
        }
      }
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener movimientos')
      }
      const data = await response.json()
      console.log('Movimientos obtenidos:', {
        total: data.total,
        count: data.movements?.length || 0
      })
      return data
    } catch (error) {
      console.error('Error obteniendo movimientos:', error)
      throw error
    }
  }
}

// Instancia singleton del servicio
export const mercadoPagoService = new MercadoPagoService() 