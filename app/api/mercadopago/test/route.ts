import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar configuración
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL

    const config = {
      clientId: clientId ? 'Configurado' : 'No configurado',
      clientSecret: clientSecret ? 'Configurado' : 'No configurado',
      baseUrl: baseUrl || 'No configurado',
      redirectUri: baseUrl ? `${baseUrl}/integrations/mercadopago/callback` : 'No configurado'
    }

    // Probar conexión básica con Mercado Pago
    let connectionTest = 'No probado'
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payments/search?limit=1', {
        headers: {
          'Authorization': 'Bearer test_token',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 401) {
        connectionTest = 'Conexión OK (401 esperado con token de prueba)'
      } else if (response.status === 403) {
        connectionTest = 'Conexión OK (403 esperado con token de prueba)'
      } else {
        connectionTest = `Respuesta inesperada: ${response.status}`
      }
    } catch (error) {
      connectionTest = `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }

    return NextResponse.json({
      success: true,
      config,
      connectionTest,
      message: 'Endpoint de prueba funcionando correctamente'
    })

  } catch (error) {
    console.error('Error en /api/mercadopago/test:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
} 