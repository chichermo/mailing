'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  PaperAirplaneIcon, 
  ClockIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  SparklesIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'
import { 
  HomeIcon as HomeIconSolid, 
  UsersIcon as UsersIconSolid, 
  DocumentTextIcon as DocumentTextIconSolid, 
  PaperAirplaneIcon as PaperAirplaneIconSolid, 
  ClockIcon as ClockIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    description: 'System overview and main controls'
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
    description: 'Manage contact lists and subscribers'
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
    description: 'Create and edit email templates'
  },
  {
    id: 'send-emails',
    label: 'Send Emails',
    icon: PaperAirplaneIcon,
    iconSolid: PaperAirplaneIconSolid,
    description: 'Email marketing campaigns'
  },
  {
    id: 'history',
    label: 'History',
    icon: ClockIcon,
    iconSolid: ClockIconSolid,
    description: 'Email history and metrics'
  },
  {
    id: 'dance-stats',
    label: 'Statistics',
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    description: 'Analytics and reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
    description: 'System configuration'
  }
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="sidebar min-h-screen">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-success-400 to-success-600 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Heliopsis Mail
            </h1>
            <p className="text-xs text-gray-500 font-medium">Email Marketing Pro</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          const IconComponent = isActive ? item.iconSolid : item.icon
          
          return (
            <div key={item.id} className="relative group">
              {/* Indicador de hover */}
              <div className={`
                absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20' 
                  : 'bg-gradient-to-r from-gray-100/50 to-gray-200/50'
                }
              `}></div>
              
              {/* Item del menú */}
              <button
                onClick={() => onTabChange(item.id)}
                className={`
                  relative w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
              >
                {/* Fondo del item activo */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg"></div>
                )}
                
                {/* Contenido del item */}
                <div className="relative flex items-center w-full">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100/50 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                    }
                  `}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  
                  <div className="ml-3 flex-1 text-left">
                    <div className={`
                      font-medium transition-colors duration-300
                      ${isActive ? 'text-white' : 'text-gray-900'}
                    `}>
                      {item.label}
                    </div>
                    <div className={`
                      text-xs transition-colors duration-300
                      ${isActive ? 'text-white/80' : 'text-gray-500'}
                    `}>
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Indicador de estado activo */}
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  )}
                </div>
              </button>
              
              {/* Efecto de brillo en hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl"></div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
        <div className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-xl p-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-success-400 to-success-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">System Active</div>
              <div className="text-xs text-gray-500">All services running</div>
            </div>
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
        </button>
      </div>
    </div>
  )
}
