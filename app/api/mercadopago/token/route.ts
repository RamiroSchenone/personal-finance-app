import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ 
        error: 'Código de autorización requerido' 
      }, { status: 400 })
    }

    // Obtener el usuario actual
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Usuario no autenticado' 
      }, { status: 401 })
    }

    // Configuración de Mercado Pago
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/integrations/mercadopago/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json({ 
        error: 'Configuración de Mercado Pago incompleta' 
      }, { status: 500 })
    }

    // Intercambiar código por token
    const tokenResponse = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Error de Mercado Pago al intercambiar token:', errorData)
      
      // Manejar errores específicos
      if (errorData.error === 'invalid_grant') {
        return NextResponse.json({ 
          error: 'Código de autorización inválido o expirado',
          details: 'El código de autorización ha expirado o ya fue utilizado',
          code: 'INVALID_GRANT'
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: 'Error al intercambiar código por token',
        details: errorData.message || 'Error desconocido',
        mercadopagoError: errorData
      }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()
    
    // Almacenar el token asociado al usuario
    const { error: storageError } = await supabase
      .from('mercadopago_tokens')
      .upsert({
        user_id: user.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
        token_type: tokenData.token_type,
        scope: tokenData.scope
      })

    if (storageError) {
      console.error('Error almacenando token:', storageError)
      return NextResponse.json({ 
        error: 'Error al guardar token de acceso' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Token obtenido exitosamente',
      user_id: user.id
    })

  } catch (error) {
    console.error('Error en /api/mercadopago/token:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 