'use client'

import { useMercadoPago } from '@/hooks/useMercadoPago'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, CheckCircle, XCircle, Loader2, User, LogOut, Home, CreditCard, Link } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { UserInfo } from '@/components/ui/UserInfo'
import { LogoutButton } from '@/components/ui/LogoutButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function IntegrationsPage() {
  const {
    isConfigured,
    isAuthenticated,
    isLoading,
    error,
    user,
    authenticate,
    logout,
    clearError
  } = useMercadoPago()

  const router = useRouter()

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "transacciones", title: "Transacciones", icon: CreditCard },
    { id: "integraciones", title: "Integraciones", icon: Link },
  ]

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
          <div className="w-1/5 min-w-[280px] bg-white dark:bg-gray-800 flex flex-col">
            <div className="p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceApp</h1>
            </div>
            <nav className="flex-1 px-6">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.id === "transacciones") {
                          router.push("/transactions")
                        } else if (item.id === "integraciones") {
                          router.push("/integrations")
                        } else {
                          router.push("/")
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                        item.id === "integraciones"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-6">
              <div className="space-y-4">
                <UserInfo />
                <LogoutButton />
                <ThemeToggle />
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  FinanceApp v1.0
                </div>
              </div>
            </div>
          </div>
          <div className="w-4/5 flex flex-col">
            <div className="flex-1 p-8 overflow-auto">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Cargando integraciones...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        {/* Sidebar - 20% */}
        <div className="w-1/5 min-w-[280px] bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceApp</h1>
          </div>

          <nav className="flex-1 px-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === "transacciones") {
                        router.push("/transactions")
                      } else if (item.id === "integraciones") {
                        router.push("/integrations")
                      } else {
                        router.push("/")
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      item.id === "integraciones"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer del sidebar con información del usuario, logout y toggle de tema */}
          <div className="p-6">
            <div className="space-y-4">
              <UserInfo />
              <LogoutButton />
              <ThemeToggle />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                FinanceApp v1.0
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 80% */}
        <div className="w-4/5 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="animate-slide-in-up">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Integraciones
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Conecta tu aplicación con servicios externos para sincronizar datos automáticamente.
                </p>
              </div>

              {/* Mercado Pago Integration */}
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
                  {!isConfigured ? (
                    <div className="text-center py-8">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Configuración requerida
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Las credenciales de Mercado Pago no están configuradas. Contacta al administrador.
                      </p>
                    </div>
                  ) : isAuthenticated ? (
                    <div className="space-y-4">
                      {user && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <Button onClick={logout} variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <LogOut className="w-4 h-4" />
                          Desconectar
                        </Button>
                        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                          <ExternalLink className="w-4 h-4" />
                          Sincronizar movimientos
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                          ¿Qué puedes hacer?
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Sincronizar movimientos bancarios automáticamente</li>
                          <li>• Importar transacciones de Mercado Pago</li>
                          <li>• Mantener tus finanzas actualizadas</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={authenticate}
                        className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Conectar con Mercado Pago
                      </Button>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                        <Button onClick={clearError} variant="ghost" size="sm" className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Placeholder para futuras integraciones */}
              <Card className="opacity-50 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">+</span>
                    </div>
                    Más integraciones próximamente
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Estamos trabajando para agregar más opciones de integración
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Próximamente podrás conectar con otros servicios financieros y bancos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 