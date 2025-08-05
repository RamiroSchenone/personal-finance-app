'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp } from 'lucide-react'

export default function BudgetsContent() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Presupuestos</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gestiona tus presupuestos mensuales y controla tus gastos por categoría.
        </p>
      </div>

      {/* Placeholder Content */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp className="w-5 h-5" />
            Próximamente
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            La funcionalidad de presupuestos estará disponible próximamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Presupuestos en desarrollo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Estamos trabajando para traerte una herramienta completa de gestión de presupuestos.
            </p>
            <Button disabled className="gap-2">
              <Plus className="w-4 h-4" />
              Crear Presupuesto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 