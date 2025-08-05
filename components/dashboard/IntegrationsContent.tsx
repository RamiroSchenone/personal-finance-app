'use client'

import { useMercadoPago } from '@/hooks/useMercadoPago'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, RefreshCw, ExternalLink, AlertTriangle, Info } from 'lucide-react'
import MercadoPagoPayments from '@/components/MercadoPagoPayments'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function IntegrationsContent() {
  const searchParams = useSearchParams()
  const [urlMessage, setUrlMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const {
    isConfigured,
    isAuthenticated,
    isLoading,
    error,
    user,
    payments,
    paymentsLoading,
    authenticate,
    logout,
    clearError,
    loadPayments
  } = useMercadoPago()

  const [diagnosticInfo, setDiagnosticInfo] = useState<{
    config?: {
      clientId: string
      clientSecret: string
      baseUrl: string
      redirectUri: string
    }
    connectionTest?: string
    error?: string
  } | null>(null)
  const [showDiagnostic, setShowDiagnostic] = useState(false)

  // Manejar parámetros de URL después del callback
  useEffect(() => {
    const success = searchParams.get('success')
    const errorParam = searchParams.get('error')

    if (success === 'true') {
      setUrlMessage({
        type: 'success',
        message: '¡Integración con Mercado Pago exitosa! Ya puedes ver tus transacciones.'
      })
      // Recargar el estado después de una integración exitosa
      setTimeout(() => {
        window.location.href = '/integrations'
      }, 3000)
    } else if (errorParam) {
      setUrlMessage({
        type: 'error',
        message: decodeURIComponent(errorParam)
      })
    }
  }, [searchParams])

  const runDiagnostic = async () => {
    try {
      const response = await fetch('/api/mercadopago/test')
      const data = await response.json()
      setDiagnosticInfo(data)
      setShowDiagnostic(true)
    } catch {
      setDiagnosticInfo({ error: 'Error al ejecutar diagnóstico' })
      setShowDiagnostic(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando integraciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integraciones</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Conecta tu aplicación con servicios externos para sincronizar datos automáticamente.
        </p>
      </div>

      {/* Mensaje de URL */}
      {urlMessage && (
        <div className={`p-4 mb-6 rounded-lg border ${
          urlMessage.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start gap-3">
            {urlMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <div className={`font-medium ${
                urlMessage.type === 'success' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {urlMessage.type === 'success' ? 'Integración Exitosa' : 'Error de Integración'}
              </div>
              <div className={`text-sm mt-1 ${
                urlMessage.type === 'success' 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {urlMessage.message}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Mercado Pago */}
      <Card className="mb-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                Mercado Pago
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Sincroniza tus movimientos bancarios y transacciones de Mercado Pago
              </CardDescription>
            </div>
            <Badge variant={isAuthenticated ? "default" : "secondary"} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {isAuthenticated ? (
                <CheckCircle className="w-4 h-4 mr-1" />
              ) : (
                <XCircle className="w-4 h-4 mr-1" />
              )}
              {isAuthenticated ? 'Conectado' : 'No conectado'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {!isConfigured && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Configuración requerida
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    Las variables de entorno de Mercado Pago no están configuradas.
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={runDiagnostic}
                      variant="outline"
                      size="sm"
                      className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Ejecutar diagnóstico
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-red-800 dark:text-red-200 font-medium">Error de conexión</div>
                  <div className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={() => {
                        clearError()
                        authenticate()
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-700 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reintentar
                    </Button>
                    <Button
                      onClick={runDiagnostic}
                      variant="outline"
                      size="sm"
                      className="text-red-700 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Diagnóstico
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated && user && (
            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Conectado como: <span className="font-medium">{user.first_name} {user.last_name}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Email: <span className="font-medium">{user.email}</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={loadPayments}
                  disabled={paymentsLoading}
                  variant="outline"
                  size="sm"
                >
                  {paymentsLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Actualizar pagos
                </Button>
                
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Desconectar
                </Button>
              </div>
            </div>
          )}

          {!isAuthenticated && isConfigured && (
            <div className="flex gap-2">
              <Button
                onClick={authenticate}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Conectar con Mercado Pago
              </Button>
              
              <Button
                onClick={runDiagnostic}
                variant="outline"
                size="sm"
              >
                <Info className="w-4 h-4 mr-2" />
                Diagnóstico
              </Button>
            </div>
          )}

          {/* Mostrar pagos si están disponibles */}
          {isAuthenticated && payments.length > 0 && (
            <div className="mt-6">
              <MercadoPagoPayments payments={payments} loading={paymentsLoading} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de Diagnóstico */}
      {showDiagnostic && diagnosticInfo && (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Info className="w-5 h-5" />
              Información de Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {diagnosticInfo.error ? (
              <div className="text-red-600 dark:text-red-400">
                Error: {diagnosticInfo.error}
              </div>
            ) : (
              <div className="space-y-3">
                {diagnosticInfo.config && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Configuración:
                    </div>
                    <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                      <div>Client ID: {diagnosticInfo.config.clientId ? 'Configurado' : 'No configurado'}</div>
                      <div>Client Secret: {diagnosticInfo.config.clientSecret ? 'Configurado' : 'No configurado'}</div>
                      <div>Base URL: {diagnosticInfo.config.baseUrl}</div>
                      <div>Redirect URI: {diagnosticInfo.config.redirectUri}</div>
                    </div>
                  </div>
                )}
                {diagnosticInfo.connectionTest && (
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Prueba de conexión:</div>
                    <div className="text-gray-600 dark:text-gray-400">{diagnosticInfo.connectionTest}</div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4">
              <Button
                onClick={() => setShowDiagnostic(false)}
                variant="outline"
                size="sm"
              >
                Ocultar diagnóstico
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 