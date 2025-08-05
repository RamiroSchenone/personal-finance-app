import { createClientAsync } from '@/lib/supabase/server'

export interface MercadoPagoToken {
  access_token: string
  refresh_token: string
  expires_at: string
  token_type: string
  scope: string
}

export interface MercadoPagoTransaction {
  id: string
  transaction_amount: number
  description?: string
  date_created: string
  status: string
  payment_type_id: string
  payment_method_id: string
  external_reference?: string
}

/**
 * Refresca el token de acceso de Mercado Pago
 */
export async function refreshMpToken(userId: number): Promise<MercadoPagoToken | null> {
  try {
    const supabase = await createClientAsync()
    
    // Obtener el token actual del usuario
    const { data: tokenData, error: tokenError } = await supabase
      .from('mercado_pago_tokens')
      .select('refresh_token')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData?.refresh_token) {
      console.error('No se encontró refresh token para el usuario:', userId)
      return null
    }

    // Configuración de Mercado Pago
    const clientId = process.env.MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Configuración de Mercado Pago incompleta')
      return null
    }

    // Solicitar nuevo token usando refresh_token
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokenData.refresh_token
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
      console.error('Error refrescando token:', errorData)
      return null
    }

    const newTokenData = await response.json()
    
    // Actualizar el token en la base de datos
    const { error: updateError } = await supabase
      .from('mercado_pago_tokens')
      .update({
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
        expires_at: new Date(Date.now() + (newTokenData.expires_in * 1000)).toISOString()
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error actualizando token:', updateError)
      return null
    }

    return {
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
      expires_at: new Date(Date.now() + (newTokenData.expires_in * 1000)).toISOString(),
      token_type: newTokenData.token_type,
      scope: newTokenData.scope
    }

  } catch (error) {
    console.error('Error en refreshMpToken:', error)
    return null
  }
}

/**
 * Obtiene el token válido del usuario (refresca si es necesario)
 */
export async function getValidAccessToken(userId: number): Promise<string | null> {
  try {
    const supabase = await createClientAsync()
    
    // Obtener el token del usuario
    const { data: tokenData, error: tokenError } = await supabase
      .from('mercado_pago_tokens')
      .select('access_token, expires_at')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData) {
      console.error('No se encontró token para el usuario:', userId)
      return null
    }

    // Verificar si el token ha expirado
    const isExpired = new Date(tokenData.expires_at) < new Date()
    
    if (isExpired) {
      console.log('Token expirado, refrescando...')
      const refreshedToken = await refreshMpToken(userId)
      return refreshedToken?.access_token || null
    }

    return tokenData.access_token

  } catch (error) {
    console.error('Error en getValidAccessToken:', error)
    return null
  }
}

/**
 * Obtiene las transacciones del usuario de Mercado Pago
 */
export async function getUserTransactions(userId: number, limit: number = 50, offset: number = 0): Promise<{
  transactions: MercadoPagoTransaction[]
  total: number
  paging: any
} | null> {
  try {
    const accessToken = await getValidAccessToken(userId)
    
    if (!accessToken) {
      console.error('No se pudo obtener token válido para el usuario:', userId)
      return null
    }

    // Obtener transacciones de Mercado Pago
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/search?limit=${limit}&offset=${offset}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
      console.error('Error obteniendo transacciones:', errorData)
      return null
    }

    const data = await response.json()
    
    // Transformar las transacciones
    const transactions: MercadoPagoTransaction[] = (data.results || []).map((payment: any) => ({
      id: payment.id,
      transaction_amount: payment.transaction_amount,
      description: payment.description,
      date_created: payment.date_created,
      status: payment.status,
      payment_type_id: payment.payment_type_id,
      payment_method_id: payment.payment_method_id,
      external_reference: payment.external_reference
    }))

    return {
      transactions,
      total: data.paging?.total || 0,
      paging: data.paging || {}
    }

  } catch (error) {
    console.error('Error en getUserTransactions:', error)
    return null
  }
}

/**
 * Obtiene información del usuario de Mercado Pago
 */
export async function getUserInfo(userId: number): Promise<{
  id: number
  nickname: string
  email: string
  first_name: string
  last_name: string
} | null> {
  try {
    const accessToken = await getValidAccessToken(userId)
    
    if (!accessToken) {
      console.error('No se pudo obtener token válido para el usuario:', userId)
      return null
    }

    // Obtener información del usuario
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
      console.error('Error obteniendo información del usuario:', errorData)
      return null
    }

    const userData = await response.json()
    
    return {
      id: userData.id,
      nickname: userData.nickname || '',
      email: userData.email || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || ''
    }

  } catch (error) {
    console.error('Error en getUserInfo:', error)
    return null
  }
} 