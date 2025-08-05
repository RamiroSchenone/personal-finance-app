'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MercadoPagoLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir inmediatamente a la autorización de Mercado Pago
    const clientId = process.env.NEXT_PUBLIC_MERCADOPAGO_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/callback`
      : 'http://localhost:3000/api/mercadopago/callback'

    if (!clientId) {
      console.error('MP_CLIENT_ID no está configurado')
      return
    }

    const authUrl = new URL('https://auth.mercadopago.com.ar/authorization')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('platform_id', 'mp')
    authUrl.searchParams.set('redirect_uri', redirectUri)

    // Redirigir a la autorización de Mercado Pago
    window.location.href = authUrl.toString()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Conectando con Mercado Pago...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Serás redirigido a Mercado Pago para autorizar el acceso
        </p>
      </div>
    </div>
  )
} 