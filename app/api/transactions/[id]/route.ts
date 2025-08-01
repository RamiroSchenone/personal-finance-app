import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Remover la fecha del body para que no se pueda editar
    const { date, ...updateData } = body

    // Actualizar la transacción (sin la fecha)
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id) // Asegurar que solo actualice sus propias transacciones
      .select()
      .single()

    if (error) {
      console.error('Error updating transaction:', error)
      return NextResponse.json({ error: 'Error al actualizar la transacción' }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error in PATCH /api/transactions/[id]:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
} 