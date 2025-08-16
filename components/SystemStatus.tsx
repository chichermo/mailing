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
  ServerIcon
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
        toast.error('Error al cargar estado del sistema')
      }
    } catch (error) {
      console.error('Error loading system status:', error)
      toast.error('Error al cargar estado del sistema')
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
        toast.success('SendGrid funcionando correctamente')
      } else {
        toast.error(`SendGrid: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error al probar SendGrid')
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
        toast.success('Resend funcionando correctamente')
      } else {
        toast.error(`Resend: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error al probar Resend')
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
        toast.success('Twilio funcionando correctamente')
      } else {
        toast.error(`Twilio: ${result.message}`)
      }
      
      // Recargar estado
      await loadSystemStatus()
    } catch (error) {
      toast.error('Error al probar Twilio')
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
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    }
  }

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200'
      case 'pending':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  // Función para obtener el ícono del servicio
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'database':
        return <ServerIcon className="w-5 h-5" />
      case 'sendgrid':
        return <EnvelopeIcon className="w-5 h-5" />
      case 'resend':
        return <EnvelopeIcon className="w-5 h-5" />
      case 'twilio':
        return <ChatBubbleLeftRightIcon className="w-5 h-5" />
      default:
        return <ServerIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estado del Sistema</h2>
          <p className="text-gray-600">Monitoreo en tiempo real de todos los servicios</p>
        </div>
        
        <button
          onClick={loadSystemStatus}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Resumen */}
      {statusData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ServerIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusData.summary.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Conectados</p>
                <p className="text-2xl font-bold text-green-600">{statusData.summary.connected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{statusData.summary.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Errores</p>
                <p className="text-2xl font-bold text-red-600">{statusData.summary.error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado de Servicios */}
      {statusData && (
        <div className="space-y-4">
          {statusData.services.map((service) => (
            <div
              key={service.name}
              className={`p-4 rounded-lg border ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getServiceIcon(service.name)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  
                  {/* Botones de prueba según el servicio */}
                  {service.name === 'SendGrid' && (
                    <button
                      onClick={testSendGrid}
                      disabled={testing === 'sendgrid'}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      {testing === 'sendgrid' ? 'Probando...' : 'Probar'}
                    </button>
                  )}
                  
                  {service.name === 'Resend' && (
                    <button
                      onClick={testResend}
                      disabled={testing === 'resend'}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      {testing === 'resend' ? 'Probando...' : 'Probar'}
                    </button>
                  )}
                  
                  {service.name === 'Twilio' && (
                    <button
                      onClick={testTwilio}
                      disabled={testing === 'twilio'}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      {testing === 'twilio' ? 'Probando...' : 'Probar'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timestamp */}
      {statusData && (
        <div className="text-center text-sm text-gray-500">
          Última actualización: {new Date(statusData.timestamp).toLocaleString('es-ES')}
        </div>
      )}

      {/* Estado de carga */}
      {loading && !statusData && (
        <div className="text-center py-8">
          <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-500">Cargando estado del sistema...</p>
        </div>
      )}
    </div>
  )
}
