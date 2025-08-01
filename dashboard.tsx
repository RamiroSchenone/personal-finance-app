"use client"
import {
  Home,
  Settings,
  CreditCard,
  TrendingUp,
  Wallet,
  DollarSign,
  ArrowUpRight,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { WelcomeSection } from "@/components/dashboard/WelcomeSection"

// Componente para el gráfico de torta
function PieChart({
  data,
  size = 200,
}: { data: Array<{ name: string; value: number; color: string }>; size?: number }) {
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
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-300 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para el progress ring
function ProgressRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center group">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          filter="url(#glow)"
          style={{
            animation: "progressAnimation 2s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600">
          {percentage}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Gastado</span>
      </div>
    </div>
  )
}

// Datos de ejemplo
const transacciones = [
  { fecha: "15/1/2024", descripcion: "Supermercado Central", categoria: "Alimentación", monto: -85.5, tipo: "gasto" },
  { fecha: "14/1/2024", descripcion: "Salario", categoria: "Ingresos", monto: 2500.0, tipo: "ingreso" },
  { fecha: "13/1/2024", descripcion: "Gasolina Shell", categoria: "Transporte", monto: -45.2, tipo: "gasto" },
  { fecha: "12/1/2024", descripcion: "Netflix", categoria: "Entretenimiento", monto: -12.99, tipo: "gasto" },
  { fecha: "11/1/2024", descripcion: "Farmacia", categoria: "Salud", monto: -28.75, tipo: "gasto" },
  { fecha: "10/1/2024", descripcion: "Uber", categoria: "Transporte", monto: -15.3, tipo: "gasto" },
  { fecha: "09/1/2024", descripcion: "Freelance", categoria: "Ingresos", monto: 800.0, tipo: "ingreso" },
  { fecha: "08/1/2024", descripcion: "Cine", categoria: "Entretenimiento", monto: -25.0, tipo: "gasto" },
]

const gastosDistribucion = [
  { name: "Alimentación", value: 450, color: "#3b82f6" },
  { name: "Transporte", value: 280, color: "#8b5cf6" },
  { name: "Entretenimiento", value: 150, color: "#06b6d4" },
  { name: "Salud", value: 120, color: "#10b981" },
]

const presupuestos = [
  { categoria: "Alimentación", presupuesto: 500, gastado: 450, porcentaje: 90 },
  { categoria: "Transporte", presupuesto: 300, gastado: 280, porcentaje: 93 },
  { categoria: "Entretenimiento", presupuesto: 200, gastado: 150, porcentaje: 75 },
  { categoria: "Salud", presupuesto: 150, gastado: 120, porcentaje: 80 },
]

// Componentes de contenido para cada sección
function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* Saldo Actual */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl p-8 hover:shadow-2xl dark:hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-6 h-6" />
          <h3 className="text-xl font-semibold">Saldo Actual</h3>
        </div>
        <p className="text-5xl font-bold mb-3">$3,247.85</p>
        <p className="text-blue-100 flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4" />
          +2.5% desde el mes pasado
        </p>
      </div>

      {/* Grid de contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Distribución de Gastos - Enero</h3>
          <div className="flex justify-center">
            <PieChart data={gastosDistribucion} size={180} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">Presupuesto Mensual</h3>
          <div className="flex flex-col items-center gap-6">
            <ProgressRing percentage={68} />
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">$1,360 de $2,000</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Quedan $640 disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 hover:shadow-lg dark:hover:shadow-gray-700/25 transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Transacciones Recientes</h3>
          </div>
          <div className="space-y-4">
            {transacciones.slice(0, 5).map((transaccion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaccion.tipo === "ingreso" ? "bg-green-500" : "bg-red-500"
                    } transition-transform duration-200 group-hover:scale-125`}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{transaccion.descripcion}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaccion.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold text-sm ${
                      transaccion.monto > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaccion.monto > 0 ? "+" : ""}${Math.abs(transaccion.monto).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaccion.categoria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TransaccionesContent() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Todas las Transacciones</h2>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Transacción
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                <th className="pb-4 font-semibold text-gray-700 dark:text-gray-300">📅 Fecha</th>
                <th className="pb-4 font-semibold text-gray-700 dark:text-gray-300">Descripción</th>
                <th className="pb-4 font-semibold text-gray-700 dark:text-gray-300">🏷️ Categoría</th>
                <th className="pb-4 text-right font-semibold text-gray-700 dark:text-gray-300">Monto</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((transaccion, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="py-4 font-medium text-gray-900 dark:text-gray-100">{transaccion.fecha}</td>
                  <td className="py-4 text-gray-900 dark:text-gray-100">{transaccion.descripcion}</td>
                  <td className="py-4">
                    <Badge
                      variant={transaccion.categoria === "Ingresos" ? "default" : "secondary"}
                      className="text-xs hover:scale-105 transition-transform duration-200"
                    >
                      {transaccion.categoria}
                    </Badge>
                  </td>
                  <td
                    className={`py-4 text-right font-semibold ${
                      transaccion.monto > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaccion.monto > 0 ? "+" : ""}${Math.abs(transaccion.monto).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PresupuestosContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Presupuestos</h2>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Presupuesto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presupuestos.map((item, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{item.categoria}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Gastado</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${item.gastado} de ${item.presupuesto}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      item.porcentaje > 90 ? "bg-red-500" : item.porcentaje > 75 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${item.porcentaje}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.porcentaje}% utilizado</span>
                  <span className="text-gray-600 dark:text-gray-400">${item.presupuesto - item.gastado} restante</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ReportesContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Ingresos vs Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Ingresos</span>
                <span className="font-bold text-green-600 dark:text-green-400">+$3,300.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 dark:text-red-400">Gastos</span>
                <span className="font-bold text-red-600 dark:text-red-400">-$1,052.15</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Balance</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">+$2,247.85</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ConfiguracionContent() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h2>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200">Preferencias de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                defaultValue="María"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Moneda</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>MXN ($)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FinanceDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "transacciones", title: "Transacciones", icon: CreditCard },
    { id: "presupuestos", title: "Presupuestos", icon: Wallet },
    { id: "reportes", title: "Reportes", icon: TrendingUp },
    { id: "configuracion", title: "Configuración", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent />
      case "transacciones":
        return <TransaccionesContent />
      case "presupuestos":
        return <PresupuestosContent />
      case "reportes":
        return <ReportesContent />
      case "configuracion":
        return <ConfiguracionContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <>
      <style jsx global>{`
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
        
        @keyframes progressAnimation {
          from {
            stroke-dashoffset: ${2 * Math.PI * 60};
          }
          to {
            stroke-dashoffset: ${2 * Math.PI * 60 - (68 / 100) * 2 * Math.PI * 60};
          }
        }
        
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
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      activeSection === item.id
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
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content - 80% */}
        <div className="w-4/5 flex flex-col">
          {/* Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="animate-slide-in-up">
              {activeSection === "dashboard" && <WelcomeSection />}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
