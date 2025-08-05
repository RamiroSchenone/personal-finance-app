import { NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'
import { getUserTransactions } from '@/lib/mercadopago'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Obtener el usuario actual
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Usuario no autenticado' 
      }, { status: 401 })
    }

    // Buscar el token de Mercado Pago asociado al usuario actual
    const { data: tokenData, error: tokenError } = await supabase
      .from('mercado_pago_tokens')
      .select('user_id')
      .limit(1)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'No se encontró token de Mercado Pago para este usuario',
        details: 'Necesitas autorizar la integración con Mercado Pago',
        code: 'NO_TOKEN_FOUND'
      }, { status: 404 })
    }

    // Obtener transacciones usando el helper
    const transactionsData = await getUserTransactions(tokenData.user_id, limit, offset)

    if (!transactionsData) {
      return NextResponse.json({ 
        error: 'No se pudo obtener transacciones de Mercado Pago',
        details: 'El token puede haber expirado o ser inválido',
        code: 'TRANSACTIONS_ERROR'
      }, { status: 404 })
    }

    return NextResponse.json({
      payments: transactionsData.transactions,
      total: transactionsData.total,
      paging: transactionsData.paging
    })

  } catch (error) {
    console.error('Error en /api/mercadopago/payments:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
} 