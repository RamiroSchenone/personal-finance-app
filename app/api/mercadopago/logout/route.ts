import { NextRequest, NextResponse } from 'next/server'
import { createClientAsync } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClientAsync()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Eliminar token de la base de datos
    const { error: deleteError } = await supabase
      .from('mercadopago_tokens')
      .delete()
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error eliminando token:', deleteError)
      return NextResponse.json({ error: 'Error al eliminar token' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Sesión cerrada correctamente'
    })

  } catch (error) {
    console.error('Error en /api/mercadopago/logout:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 