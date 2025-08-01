'use client'

import { useMercadoPago } from '@/hooks/useMercadoPago'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

export function MercadoPagoMovements() {
  const { movements, movementsLoading, isAuthenticated, loadMovements } = useMercadoPago()

  if (!isAuthenticated) {
    return null
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'ingresos': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'pagos': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'transferencias': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'comisiones': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'otros': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return colors[category] || colors['otros']
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Movimientos Mercado Pago</CardTitle>
          <CardDescription>
            Transacciones sincronizadas desde tu cuenta de Mercado Pago
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadMovements}
          disabled={movementsLoading}
        >
          {movementsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {movementsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Cargando movimientos...</span>
          </div>
        ) : movements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay movimientos disponibles
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    movement.type === 'income' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                  }`}>
                    {movement.type === 'income' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{movement.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(movement.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(movement.category)}>
                    {movement.category}
                  </Badge>
                  <div className={`font-semibold ${
                    movement.type === 'income' 
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {movement.type === 'income' ? '+' : '-'}
                    {formatAmount(movement.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 