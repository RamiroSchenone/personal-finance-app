'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Settings, CreditCard, TrendingUp, Wallet } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LogoutButton } from '@/components/ui/LogoutButton'
import { UserInfo } from '@/components/ui/UserInfo'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState(() => {
    if (pathname === '/') return 'dashboard'
    if (pathname === '/transactions') return 'transacciones'
    if (pathname === '/budgets') return 'presupuestos'
    if (pathname === '/reports') return 'reportes'
    if (pathname === '/settings') return 'configuracion'
    return 'dashboard'
  })

  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home, path: "/" },
    { id: "transacciones", title: "Transacciones", icon: CreditCard, path: "/transactions" },
    { id: "presupuestos", title: "Presupuestos", icon: Wallet, path: "/budgets" },
    { id: "reportes", title: "Reportes", icon: TrendingUp, path: "/reports" },
    { id: "configuracion", title: "Configuración", icon: Settings, path: "/settings" },
  ]

  const handleNavigation = (item: any) => {
    setActiveSection(item.id)
    router.push(item.path)
  }

  return (
    <ProtectedRoute>
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
                    onClick={() => handleNavigation(item)}
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
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 