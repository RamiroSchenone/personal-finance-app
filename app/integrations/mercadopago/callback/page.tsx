'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function MercadoPagoCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      // Si hay un error, notificar al padre
      window.opener?.postMessage({
        type: 'MERCADOPAGO_AUTH_ERROR',
        error: error
      }, window.location.origin)
      window.close()
      return
    }

    if (code) {
      // Si hay un código, notificar al padre
      window.opener?.postMessage({
        type: 'MERCADOPAGO_AUTH_SUCCESS',
        code: code
      }, window.location.origin)
      window.close()
      return
    }

    // Si no hay código ni error, cerrar la ventana
    window.close()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Procesando autorización...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Por favor, espera mientras procesamos tu autorización de Mercado Pago.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  )
} 