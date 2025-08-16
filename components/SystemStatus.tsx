'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  XCircleIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ServerIcon,
  SparklesIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ServiceStatus {
  name: string
  status: 'connected' | 'pending' | 'error'
  message: string
  details?: any
}

interface SystemStatusData {
  timestamp: string
  services: ServiceStatus[]
  summary: {
    total: number
    connected: number
    pending: number
    error: number
  }
}

export default function SystemStatus() {
  const [statusData, setStatusData] = useState<SystemStatusData | null>(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)

  // Cargar estado del sistema
  const loadSystemStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/system-status')
      const result = await response.json()
      
      if (result.success) {
        setStatusData(result.data)
      } else {
        toast.error('Error loading system status')
      }
    } catch (error) {
      console.error('Error loading system status:', error)
      toast.error('Error loading system status')
    } finally {
      setLoading(false)
    }
  }

  // Probar servicio SendGrid
  const testSendGrid = async () => {
    try {
      setTesting('sendgrid')
      const response = await fetch('/api/test-services/sendgrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: 'guillermoromerog@gmail.com' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('SendGrid working correctly')
      } else {
        toast.error(`SendGrid: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error testing SendGrid')
    } finally {
      setTesting(null)
    }
  }

  // Probar servicio Resend
  const testResend = async () => {
    try {
      setTesting('resend')
      const response = await fetch('/api/test-services/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail: 'guillermoromerog@gmail.com' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Resend working correctly')
      } else {
        toast.error(`Resend: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error testing Resend')
    } finally {
      setTesting(null)
    }
  }

  // Probar servicio Twilio
  const testTwilio = async () => {
    try {
      setTesting('twilio')
      const response = await fetch('/api/test-services/twilio')
      const result = await response.json()
      
      if (result.success) {
        toast.success('Twilio working correctly')
      } else {
        toast.error(`Twilio: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error testing Twilio')
    } finally {
      setTesting(null)
    }
  }

  // Cargar estado al montar el componente
  useEffect(() => {
    loadSystemStatus()
  }, [])

  // Función para obtener el ícono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="w-6 h-6 text-success-500" />
      case 'pending':
        return <ClockIcon className="w-6 h-6 text-warning-500" />
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-error-500" />
      default:
        return <ExclamationTriangleIcon className="w-6 h-6 text-gray-500" />
    }
  }

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'from-success-50 to-success-100 border-success-200'
      case 'pending':
        return 'from-warning-50 to-warning-100 border-warning-200'
      case 'error':
        return 'from-error-50 to-error-100 border-error-200'
      default:
        return 'from-gray-50 to-gray-100 border-gray-200'
    }
  }

  // Función para obtener el ícono del servicio
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'database':
        return <ServerIcon className="w-6 h-6" />
      case 'sendgrid':
        return <EnvelopeIcon className="w-6 h-6" />
      case 'resend':
        return <EnvelopeIcon className="w-6 h-6" />
      case 'twilio':
        return <ChatBubbleLeftRightIcon className="w-6 h-6" />
      default:
        return <ServerIcon className="w-6 h-6" />
    }
  }

  // Función para obtener el color del servicio
  const getServiceColor = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'database':
        return 'from-blue-500 to-blue-600'
      case 'sendgrid':
        return 'from-purple-500 to-purple-600'
      case 'resend':
        return 'from-indigo-500 to-indigo-600'
      case 'twilio':
        return 'from-green-500 to-green-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header mejorado */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-3 rounded-2xl border border-primary-200/50">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <BoltIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            System Status
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real-time monitoring of all services. Verify status and test connectivity of each component.
        </p>
      </div>

      {/* Resumen mejorado */}
      {statusData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card card-hover group">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <ServerIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{statusData.summary.total}</div>
              <div className="text-sm text-gray-600 font-medium">Total Services</div>
              <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Monitored
              </div>
            </div>
          </div>
          
          <div className="card card-hover group">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-success-600 mb-2">{statusData.summary.connected}</div>
              <div className="text-sm text-gray-600 font-medium">Connected</div>
              <div className="mt-3 text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">
                Running
              </div>
            </div>
          </div>
          
          <div className="card card-hover group">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-warning-600 mb-2">{statusData.summary.pending}</div>
              <div className="text-sm text-gray-600 font-medium">Pending</div>
              <div className="mt-3 text-xs text-warning-600 bg-warning-50 px-2 py-1 rounded-full">
                Need Configuration
              </div>
            </div>
          </div>
          
          <div className="card card-hover group">
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-error-500 to-error-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <XCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-error-600 mb-2">{statusData.summary.error}</div>
              <div className="text-sm text-gray-600 font-medium">Errors</div>
              <div className="mt-3 text-xs text-error-600 bg-error-50 px-2 py-1 rounded-full">
                Need Attention
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado de Servicios mejorado */}
      {statusData && (
        <div className="space-y-6">
          {statusData.services.map((service) => (
            <div
              key={service.name}
              className={`card card-hover group border-2 bg-gradient-to-r ${getStatusColor(service.status)}`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getServiceColor(service.name)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {getServiceIcon(service.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <span className={`text-sm font-medium ${
                        service.status === 'connected' ? 'text-success-700' :
                        service.status === 'pending' ? 'text-warning-700' :
                        'text-error-700'
                      }`}>
                        {service.status === 'connected' ? 'Connected' :
                         service.status === 'pending' ? 'Pending' : 'Error'}
                      </span>
                    </div>
                    
                    {/* Botones de prueba según el servicio */}
                    {service.name === 'SendGrid' && (
                      <button
                        onClick={testSendGrid}
                        disabled={testing === 'sendgrid'}
                        className="btn-secondary btn-sm group-hover:scale-105 transition-transform duration-200"
                      >
                        {testing === 'sendgrid' ? (
                          <div className="flex items-center space-x-2">
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            <span>Testing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="w-4 h-4" />
                            <span>Test</span>
                          </div>
                        )}
                      </button>
                    )}
                    
                    {service.name === 'Resend' && (
                      <button
                        onClick={testResend}
                        disabled={testing === 'resend'}
                        className="btn-secondary btn-sm group-hover:scale-105 transition-transform duration-200"
                      >
                        {testing === 'resend' ? (
                          <div className="flex items-center space-x-2">
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            <span>Testing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="w-4 h-4" />
                            <span>Test</span>
                          </div>
                        )}
                      </button>
                    )}
                    
                    {service.name === 'Twilio' && (
                      <button
                        onClick={testTwilio}
                        disabled={testing === 'twilio'}
                        className="btn-secondary btn-sm group-hover:scale-105 transition-transform duration-200"
                      >
                        {testing === 'twilio' ? (
                          <div className="flex items-center space-x-2">
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            <span>Testing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <BoltIcon className="w-4 h-4" />
                            <span>Test</span>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controles */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={loadSystemStatus}
          disabled={loading}
          className="btn-primary group"
        >
          <ArrowPathIcon className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-all duration-300`} />
          {loading ? 'Updating...' : 'Update Status'}
        </button>
        
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
          Last update: {statusData ? new Date(statusData.timestamp).toLocaleString('en-US') : 'Never'}
        </div>
      </div>

      {/* Estado de carga mejorado */}
      {loading && !statusData && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6">
            <ArrowPathIcon className="w-10 h-10 text-white animate-spin" />
          </div>
          <p className="text-lg text-gray-600 font-medium">Loading system status...</p>
          <p className="text-sm text-gray-500 mt-2">Verifying service connectivity</p>
        </div>
      )}

      {/* Footer informativo */}
      <div className="text-center py-6">
        <div className="inline-flex items-center space-x-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm">Real-time monitoring • Automatic updates</span>
        </div>
      </div>
    </div>
  )
}
