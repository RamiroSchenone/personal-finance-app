export interface MercadoPagoPayment {
  id: string
  transaction_amount: number
  description?: string
  date_created: string
  status?: string
  payment_type_id?: string
  payment_method_id?: string
  external_reference?: string
}

export interface MercadoPagoUser {
  id: number
  nickname: string
  email: string
  first_name: string
  last_name: string
}

export interface MercadoPagoConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

class MercadoPagoService {
  private config: MercadoPagoConfig | null = null

  constructor() {
    this.initializeConfig()
  }

  private initializeConfig() {
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/mercadopago/callback`

    if (clientId && clientSecret) {
      this.config = {
        clientId,
        clientSecret,
        redirectUri
      }
    }
  }

  // Verificar si la configuración está disponible
  isConfigured(): boolean {
    return this.config !== null
  }

  // Obtener URL de autorización
  getAuthorizationUrl(): string {
    if (!this.config) {
      throw new Error('Configuración de Mercado Pago no disponible')
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'read write'
    })

    return `https://auth.mercadopago.com.ar/authorization?${params.toString()}`
  }

  // Iniciar proceso de autenticación (redirigir a la página de login)
  authenticate(): void {
    const authUrl = this.getAuthorizationUrl()
    window.location.href = authUrl
  }

  // Obtener información del usuario usando MCP
  async getUserInfo(): Promise<MercadoPagoUser> {
    try {
      const response = await fetch('/api/mercadopago/user')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al obtener información del usuario')
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error)
      throw error
    }
  }

  // Obtener pagos usando MCP
  async getPayments(limit: number = 50, offset: number = 0): Promise<{
    payments: MercadoPagoPayment[]
    total: number
    paging: any
  }> {
    try {
      const response = await fetch(`/api/mercadopago/payments?limit=${limit}&offset=${offset}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener pagos')
      }

      const data = await response.json()
      return {
        payments: data.payments || [],
        total: data.total || 0,
        paging: data.paging || {}
      }
    } catch (error) {
      console.error('Error obteniendo pagos:', error)
      throw error
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await fetch('/api/mercadopago/user')
      return response.ok
    } catch {
      return false
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await fetch('/api/mercadopago/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Error cerrando sesión:', error)
    }
  }
}

// Instancia singleton del servicio
export const mercadoPagoService = new MercadoPagoService() 