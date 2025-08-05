'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, CreditCard, PiggyBank } from 'lucide-react'

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen de tus finanzas personales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Balance Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              $0
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +$0 este mes
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gastos del Mes
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              -$0
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              0 transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              +$0
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              0 ingresos
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Ahorro del Mes
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              $0
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              0% del ingreso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            ¡Bienvenido a FinanceApp!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Comienza agregando tus primeras transacciones para ver tu resumen financiero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Comienza a gestionar tus finanzas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agrega transacciones, conecta con Mercado Pago y mantén el control de tus gastos e ingresos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 