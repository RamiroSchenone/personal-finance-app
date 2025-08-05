import { NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function POST() {
  try {
    // Obtener el usuario actual
    const supabase = await createClientAsync()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ 
        error: 'Usuario no autenticado' 
      }, { status: 401 })
    }

    // Eliminar todos los tokens de Mercado Pago (ya que no tenemos relación directa con el usuario de Supabase)
    const { error: deleteError } = await supabase
      .from('mercado_pago_tokens')
      .delete()
      .neq('user_id', 0) // Eliminar todos los tokens (esto es simplificado, en producción deberías tener una relación)

    if (deleteError) {
      console.error('Error eliminando tokens:', deleteError)
      return NextResponse.json({ 
        error: 'Error al eliminar tokens de acceso' 
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Sesión de Mercado Pago cerrada exitosamente'
    })

  } catch (error) {
    console.error('Error en /api/mercadopago/logout:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 