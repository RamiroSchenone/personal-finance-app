'use client'

import { DashboardStats } from '@/hooks/useDashboardStats'

// Estilos CSS para las animaciones
const pieChartStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`

// Los colores ya están definidos en el hook useDashboardStats

interface ExpenseDistributionProps {
  stats: DashboardStats
}

// Componente para el gráfico de torta
function PieChart({
  data,
  size = 200,
}: { data: Array<{ name: string; value: number; color: string }>; size?: number }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No hay gastos este mes</p>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const radius = size / 2 - 10
  const centerX = size / 2
  const centerY = size / 2

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Círculo de fondo */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
            className="dark:stroke-gray-600"
          />
          
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const startAngle = (cumulativePercentage / 100) * 360
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360

            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180

            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)

            const largeArcFlag = percentage > 50 ? 1 : 0

            // Crear una torta sólida completa
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ")

            cumulativePercentage += percentage

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="hover:brightness-110 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                style={{
                  filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`,
                }}
              />
            )
          })}
        </svg>
        
        {/* Información central cuando hay una sola categoría */}
        {data.length === 1 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {((data[0].value / total) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {data[0].name}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm w-full">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div
              key={index}
              className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-5 h-5 rounded-full transition-transform duration-200 hover:scale-125"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600 dark:text-gray-300 font-medium text-base">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-gray-800 dark:text-gray-200 font-semibold text-base">
                  {new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS'
                  }).format(item.value)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {percentage}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ExpenseDistribution({ stats }: ExpenseDistributionProps) {
  const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  
  if (stats.expenseDistribution.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Distribución de Gastos - {currentMonth}
        </h3>
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          <p className="text-sm text-center">No hay gastos registrados este mes</p>
          <p className="text-xs text-gray-400 mt-1 text-center">Agrega transacciones de gasto para ver la distribución</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
      <style>{pieChartStyles}</style>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
        Distribución de Gastos - {currentMonth}
      </h3>
      <div className="flex justify-center">
        <PieChart data={stats.expenseDistribution} size={180} />
      </div>
    </div>
  )
} 