import { NextRequest, NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== INICIO API MOVEMENTS ===')
    
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
      console.log('Token expirado, intentando refresh...')
      if (!token.refresh_token) {
        // No hay refresh token, eliminar registro y pedir reconexión
        await supabase.from('mercadopago_tokens').delete().eq('user_id', user.id)
        return NextResponse.json({ error: 'Token de Mercado Pago expirado. Reautenticación requerida.' }, { status: 401 })
      }

      // Configuración de Mercado Pago
      const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
      const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://db43252b87e5.ngrok-free.app'
      const redirectUri = `${baseUrl}/integrations/mercadopago/callback`

      const formData = new URLSearchParams()
      formData.append('grant_type', 'refresh_token')
      formData.append('client_id', clientId || '')
      formData.append('client_secret', clientSecret || '')
      formData.append('refresh_token', token.refresh_token)
      formData.append('redirect_uri', redirectUri)

      const refreshResponse = await fetch('https://api.mercadopago.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (!refreshResponse.ok) {
        // Refresh falló, eliminar registro y pedir reconexión
        await supabase.from('mercadopago_tokens').delete().eq('user_id', user.id)
        const errorText = await refreshResponse.text()
        console.error('Error refrescando token:', errorText)
        return NextResponse.json({ error: 'No se pudo refrescar el token de Mercado Pago. Reautenticación requerida.' }, { status: 401 })
      }

      const newToken = await refreshResponse.json()
      const newExpiresAt = new Date()
      newExpiresAt.setSeconds(newExpiresAt.getSeconds() + newToken.expires_in)

      // Actualizar token en la base
      const { error: updateError } = await supabase.from('mercadopago_tokens').update({
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        token_type: newToken.token_type,
        expires_in: newToken.expires_in,
        scope: newToken.scope,
        expires_at: newExpiresAt.toISOString()
      }).eq('user_id', user.id)

      if (updateError) {
        console.error('Error actualizando token tras refresh:', updateError)
        return NextResponse.json({ error: 'Error al actualizar token tras refresh' }, { status: 500 })
      }

      // Releer el token actualizado
      const { data: refreshedToken } = await supabase
        .from('mercadopago_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!refreshedToken) {
        return NextResponse.json({ error: 'No se pudo obtener el token actualizado' }, { status: 500 })
      }

      // Usar el nuevo token para la request
      token.access_token = refreshedToken.access_token
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    // Obtener movimientos de Mercado Pago usando el token del usuario
    const response = await fetch(`https://api.mercadopago.com/v1/account/movements/search?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token.access_token}`
      }
    })

    console.log('Response status de Mercado Pago:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error de Mercado Pago:', errorText)
      return NextResponse.json({ 
        error: 'Error al obtener movimientos de Mercado Pago',
        details: errorText
      }, { status: response.status })
    }

    const movementsData = await response.json()
    console.log('Movimientos obtenidos:', { 
      total: movementsData.paging?.total,
      limit: movementsData.paging?.limit,
      offset: movementsData.paging?.offset,
      results_count: movementsData.results?.length || 0
    })

    // Transformar movimientos a nuestro formato
    const transformedMovements = movementsData.results?.map((movement: any) => {
      // Determinar tipo de transacción
      let type = 'expense'
      let category = 'otros'
      
      if (movement.type === 'credit') {
        type = 'income'
        category = 'ingresos'
      } else if (movement.type === 'debit') {
        type = 'expense'
        // Intentar categorizar basado en la descripción
        const description = movement.description?.toLowerCase() || ''
        if (description.includes('transferencia') || description.includes('transfer')) {
          category = 'transferencias'
        } else if (description.includes('pago') || description.includes('payment')) {
          category = 'pagos'
        } else if (description.includes('comision') || description.includes('fee')) {
          category = 'comisiones'
        }
      }

      return {
        id: `mp_${movement.id}`,
        amount: Math.abs(movement.amount),
        type: type,
        category: category,
        description: movement.description || 'Movimiento Mercado Pago',
        date: movement.created_at,
        source: 'mercadopago',
        original_data: movement
      }
    }) || []

    console.log('Movimientos transformados:', transformedMovements.length)

    console.log('=== ÉXITO API MOVEMENTS ===')
    return NextResponse.json({
      movements: transformedMovements,
      paging: movementsData.paging,
      total: movementsData.paging?.total || 0
    })

  } catch (error) {
    console.error('=== ERROR API MOVEMENTS ===')
    console.error('Error en /api/mercadopago/movements:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 