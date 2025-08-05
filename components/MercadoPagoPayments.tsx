'use client'

import { MercadoPagoPayment } from '@/services/mercadopago'

interface MercadoPagoPaymentsProps {
  payments: MercadoPagoPayment[]
  loading?: boolean
}

export default function MercadoPagoPayments({ payments, loading = false }: MercadoPagoPaymentsProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400 mb-2">No hay pagos disponibles</div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          Los pagos aparecerán aquí una vez que se sincronice con Mercado Pago
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {payments.slice(0, 5).map((payment) => (
        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex-1">
            <div className="font-medium">{payment.description}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(payment.date).toLocaleDateString()}
            </div>
          </div>
          <div className={`font-semibold ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {payment.type === 'income' ? '+' : '-'}${payment.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
} 