'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, User, Bell, Shield } from 'lucide-react'

export default function SettingsContent() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gestiona tu cuenta, preferencias y configuraciones de la aplicación.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5" />
              Perfil
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Gestiona tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>
              <Button className="w-full">
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configura tus preferencias de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Notificaciones por email
                </span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Recordatorios de pagos
                </span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Resúmenes semanales
                </span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Shield className="w-5 h-5" />
              Seguridad
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configura la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Cambiar contraseña
              </Button>
              <Button variant="outline" className="w-full">
                Autenticación de dos factores
              </Button>
              <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                Cerrar sesión en todos los dispositivos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Settings className="w-5 h-5" />
              Aplicación
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configuración general de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Modo oscuro
                </span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Animaciones
                </span>
                <input type="checkbox" className="rounded" />
              </div>
              <Button variant="outline" className="w-full">
                Exportar datos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 