import { NextRequest, NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== INICIO API USER ===')
    
    const supabase = await createClientAsync()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.log('Error de autenticación:', authError)
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    console.log('Usuario autenticado:', user.id)

    // Obtener token de Mercado Pago de la base de datos
    const { data: token, error: tokenError } = await supabase
      .from('mercadopago_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (tokenError || !token) {
      console.log('Token no encontrado:', tokenError)
      return NextResponse.json({ error: 'Token de Mercado Pago no encontrado' }, { status: 404 })
    }

    console.log('Token encontrado:', { 
      access_token: token.access_token ? '***' : 'no token',
      expires_at: token.expires_at 
    })

    // Verificar si el token ha expirado
    const now = new Date()
    const expiresAt = new Date(token.expires_at)
    
    if (now > expiresAt) {
      console.log('Token expirado')
      return NextResponse.json({ error: 'Token de Mercado Pago expirado' }, { status: 401 })
    }

    // Obtener información del usuario de Mercado Pago
    const response = await fetch('https://api.mercadopago.com/users/me', {
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      }
    })

    console.log('Response status de Mercado Pago:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de Mercado Pago:', errorText)
      return NextResponse.json({ 
        error: 'Error al obtener información del usuario de Mercado Pago',
        details: errorText
      }, { status: response.status })
    }

    const userData = await response.json()
    console.log('Usuario de Mercado Pago obtenido:', { 
      id: userData.id,
      nickname: userData.nickname,
      email: userData.email 
    })

    console.log('=== ÉXITO API USER ===')
    return NextResponse.json(userData)

  } catch (error) {
    console.error('=== ERROR API USER ===')
    console.error('Error en /api/mercadopago/user:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 