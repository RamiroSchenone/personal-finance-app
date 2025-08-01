'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMercadoPago } from '@/hooks/useMercadoPago'
import { useAuthContext } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'

export default function MercadoPagoCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { processCallback } = useMercadoPago()
  const { user } = useAuthContext()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Crear una versión estable del processCallback
  const stableProcessCallback = useCallback(async (code: string) => {
    if (!user) {
      throw new Error('Usuario no autenticado')
    }
    return await processCallback(code)
  }, [processCallback, user])

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    console.log('=== CALLBACK EFFECT ===')
    console.log('Code:', code)
    console.log('Error:', errorParam)
    console.log('Status actual:', status)
    console.log('IsProcessing:', isProcessing)
    console.log('Usuario disponible:', !!user)
    console.log('Usuario ID:', user?.id)

    // Si ya estamos procesando o ya tenemos un estado final, no hacer nada
    if (isProcessing || status !== 'loading') {
      console.log('Ya procesado o estado final, saltando...')
      return
    }

    // Si no hay usuario aún, esperar
    if (!user) {
      console.log('Usuario no disponible aún, esperando...')
      return
    }

    if (errorParam) {
      console.log('Error detectado:', errorParam)
      setStatus('error')
      setError('El usuario canceló la autorización')
      
      // Enviar mensaje de error a la ventana padre
      if (window.opener) {
        window.opener.postMessage({
          type: 'MERCADOPAGO_AUTH_ERROR',
          error: 'El usuario canceló la autorización'
        }, window.location.origin)
      }
      return
    }

    if (!code) {
      console.log('No hay código')
      setStatus('error')
      setError('No se recibió el código de autorización')
      
      // Enviar mensaje de error a la ventana padre
      if (window.opener) {
        window.opener.postMessage({
          type: 'MERCADOPAGO_AUTH_ERROR',
          error: 'No se recibió el código de autorización'
        }, window.location.origin)
      }
      return
    }

    // Procesar el código de autorización
    const handleCallback = async () => {
      if (isProcessing) {
        console.log('Ya procesando, saltando...')
        return
      }
      
      setIsProcessing(true)
      console.log('=== CALLBACK INICIADO ===')
      console.log('Código recibido:', code)
      console.log('Usuario:', user?.id)
      
      try {
        console.log('Llamando a stableProcessCallback...')
        await stableProcessCallback(code)
        console.log('stableProcessCallback completado exitosamente')
        setStatus('success')
        
        // Enviar mensaje de éxito a la ventana padre
        if (window.opener) {
          window.opener.postMessage({
            type: 'MERCADOPAGO_AUTH_SUCCESS',
            code: code
          }, window.location.origin)
          
          // Cerrar la ventana después de 2 segundos
          setTimeout(() => {
            window.close()
          }, 2000)
        } else {
          // Si no hay ventana padre, redirigir
          setTimeout(() => {
            router.push('/integrations')
          }, 2000)
        }
      } catch (err) {
        console.error('Error en callback:', err)
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Error al procesar la autorización')
        
        // Enviar mensaje de error a la ventana padre
        if (window.opener) {
          window.opener.postMessage({
            type: 'MERCADOPAGO_AUTH_ERROR',
            error: err instanceof Error ? err.message : 'Error al procesar la autorización'
          }, window.location.origin)
        }
      } finally {
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [searchParams, stableProcessCallback, router, status, isProcessing, user])

  const handleRetry = () => {
    router.push('/integrations')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
            {status === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
            {status === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            {status === 'loading' && 'Procesando autorización...'}
            {status === 'success' && '¡Autorización exitosa!'}
            {status === 'error' && 'Error de autorización'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Estamos conectando tu cuenta de Mercado Pago...'}
            {status === 'success' && 'Tu cuenta ha sido conectada correctamente. Redirigiendo...'}
            {status === 'error' && 'No se pudo completar la autorización'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Ahora puedes sincronizar tus movimientos bancarios y transacciones de Mercado Pago.
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {error}
                </p>
              </div>
              <Button onClick={handleRetry} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a integraciones
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 