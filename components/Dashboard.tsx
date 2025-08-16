
'use client'

import { 
  EnvelopeIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import TestAPI from './TestAPI'
import EmailTest from './EmailTest'
import SystemStatus from './SystemStatus'

interface DashboardProps {
  onTabChange?: (tab: string) => void
}

export default function Dashboard({ onTabChange }: DashboardProps) {
  const handleQuickAction = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header mejorado */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-3 rounded-2xl border border-primary-200/50">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Bienvenido a tu sistema de email marketing profesional. Monitorea el rendimiento y gestiona tus campañas desde un solo lugar.
        </p>
      </div>

      {/* Quick Stats mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-sm text-gray-600 font-medium">Total Contactos</div>
            <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              +0% este mes
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <EnvelopeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-sm text-gray-600 font-medium">Plantillas</div>
            <div className="mt-3 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              +0% este mes
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-sm text-gray-600 font-medium">Campañas</div>
            <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              +0% este mes
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
            <div className="text-sm text-gray-600 font-medium">Emails Enviados</div>
            <div className="mt-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              +0% este mes
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions mejorados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card card-hover">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => handleQuickAction('send-emails')}
                className="w-full btn-primary group"
              >
                <EnvelopeIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Crear Nueva Campaña
              </button>
              <button 
                onClick={() => handleQuickAction('contacts')}
                className="w-full btn-secondary group"
              >
                <UsersIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Agregar Contactos
              </button>
              <button 
                onClick={() => handleQuickAction('templates')}
                className="w-full btn-secondary group"
              >
                <EnvelopeIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Crear Plantilla
              </button>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Estado del Sistema</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200">
                <span className="text-sm font-medium text-gray-700">Base de Datos</span>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">Conectado</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                <span className="text-sm font-medium text-gray-700">SendGrid</span>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
                  <span className="text-sm font-medium text-warning-700">Pendiente</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                <span className="text-sm font-medium text-gray-700">Twilio</span>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
                  <span className="text-sm font-medium text-warning-700">Pendiente</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => handleQuickAction('settings')}
                className="w-full btn-ghost text-sm"
              >
                Configurar Servicios →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Estado del Sistema */}
      <SystemStatus />

      {/* Componentes de Prueba */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card card-hover">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Pruebas de API</h3>
            </div>
            <TestAPI />
          </div>
        </div>

        <div className="card card-hover">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Pruebas de Email</h3>
            </div>
            <EmailTest />
          </div>
        </div>
      </div>

      {/* Footer del Dashboard */}
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm">Heliopsis Mail - Sistema de Email Marketing Profesional</span>
        </div>
      </div>
    </div>
  )
}
