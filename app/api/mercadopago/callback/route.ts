import { NextRequest, NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Manejar errores de autorización
    if (error) {
      console.error('Error en autorización de Mercado Pago:', { error, errorDescription })
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent(errorDescription || error)}`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent('Código de autorización no recibido')}`
      )
    }

    // Obtener el usuario actual
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login?error=${encodeURIComponent('Usuario no autenticado')}`
      )
    }

    // Configuración de Mercado Pago
    const clientId = process.env.MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET
    const redirectUri = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`
      : 'http://localhost:3000/api/mercadopago/callback'

    if (!clientId || !clientSecret) {
      console.error('Configuración de Mercado Pago incompleta')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent('Configuración de Mercado Pago incompleta')}`
      )
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
      const errorData = await tokenResponse.json().catch(() => ({ message: 'Error desconocido' }))
      console.error('Error de Mercado Pago al intercambiar token:', errorData)
      
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent(errorData.message || 'Error al obtener token de acceso')}`
      )
    }

    const tokenData = await tokenResponse.json()
    
    // Obtener información del usuario de Mercado Pago para obtener el user_id
    const userInfoResponse = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userInfoResponse.ok) {
      console.error('Error obteniendo información del usuario de Mercado Pago')
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent('Error al obtener información del usuario')}`
      )
    }

    const userInfo = await userInfoResponse.json()
    const mpUserId = userInfo.id

    // Almacenar el token asociado al usuario de Mercado Pago
    const { error: storageError } = await supabase
      .from('mercado_pago_tokens')
      .upsert({
        user_id: mpUserId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()
      })

    if (storageError) {
      console.error('Error almacenando token:', storageError)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent('Error al guardar token de acceso')}`
      )
    }

    // Redirigir de vuelta a la página de integraciones con éxito
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?success=true`
    )

  } catch (error) {
    console.error('Error en callback de Mercado Pago:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/integrations?error=${encodeURIComponent('Error interno del servidor')}`
    )
  }
} 