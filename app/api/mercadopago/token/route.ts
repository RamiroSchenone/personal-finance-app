import { NextRequest, NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO API TOKEN ===')
    console.log('Request method:', request.method)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    const supabase = await createClientAsync()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('Error de autenticación:', authError)
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('Usuario autenticado:', user.id)

    // Leer el body del request
    const bodyText = await request.text()
    console.log('Body recibido:', bodyText)
    
    let body
    try {
      body = bodyText ? JSON.parse(bodyText) : {}
    } catch (error) {
      console.error('Error parseando JSON:', error)
      return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
    }

    const { code } = body

    if (!code) {
      return NextResponse.json({ error: 'Código de autorización requerido' }, { status: 400 })
    }

    // Configuración de Mercado Pago
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://db43252b87e5.ngrok-free.app'
    const redirectUri = `${baseUrl}/integrations/mercadopago/callback`

    console.log('=== CONFIGURACIÓN MERCADO PAGO ===')
    console.log('Client ID:', clientId ? '***' : 'no configurado')
    console.log('Client Secret:', clientSecret ? '***' : 'no configurado')
    console.log('Base URL:', baseUrl)
    console.log('Redirect URI:', redirectUri)

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Configuración de Mercado Pago incompleta' }, { status: 500 })
    }

    // Crear el body como form data según la documentación de Mercado Pago
    const formData = new URLSearchParams()
    formData.append('grant_type', 'authorization_code')
    formData.append('client_id', clientId)
    formData.append('client_secret', clientSecret)
    formData.append('code', code)
    formData.append('redirect_uri', redirectUri)

    console.log('Enviando request a Mercado Pago:', {
      url: 'https://api.mercadopago.com/oauth/token',
      clientId,
      code,
      redirectUri
    })

    // Intercambiar código por token
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de Mercado Pago:', errorText)
      return NextResponse.json({ 
        error: 'Error al obtener token de Mercado Pago',
        details: errorText
      }, { status: response.status })
    }

    const authData = await response.json()
    console.log('Token obtenido:', { 
      access_token: authData.access_token ? '***' : 'no token',
      expires_in: authData.expires_in,
      user_id_mp: authData.user_id 
    })

    // Calcular fecha de expiración
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + authData.expires_in)

    // Guardar token en la base de datos
    const tokenData = {
      user_id: user.id, // ID de Supabase
      access_token: authData.access_token,
      refresh_token: authData.refresh_token,
      token_type: authData.token_type,
      expires_in: authData.expires_in,
      scope: authData.scope,
      user_id_mp: authData.user_id, // ID de Mercado Pago
      expires_at: expiresAt.toISOString()
    }

    console.log('Token data a guardar:', {
      user_id: tokenData.user_id,
      user_id_mp: tokenData.user_id_mp,
      expires_at: tokenData.expires_at
    })

    // Verificar si ya existe un token para este usuario
    const { data: existingToken } = await supabase
      .from('mercadopago_tokens')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingToken) {
      // Actualizar token existente
      const { error: updateError } = await supabase
        .from('mercadopago_tokens')
        .update(tokenData)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error actualizando token:', updateError)
        return NextResponse.json({ error: 'Error al actualizar token' }, { status: 500 })
      }
    } else {
      // Insertar nuevo token
      const { error: insertError } = await supabase
        .from('mercadopago_tokens')
        .insert(tokenData)

      if (insertError) {
        console.error('Error insertando token:', insertError)
        return NextResponse.json({ error: 'Error al guardar token' }, { status: 500 })
      }
    }

    console.log('=== ÉXITO API TOKEN ===')
    return NextResponse.json({ 
      success: true,
      message: 'Token guardado correctamente'
    })

  } catch (error) {
    console.error('=== ERROR API TOKEN ===')
    console.error('Error en /api/mercadopago/token:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 