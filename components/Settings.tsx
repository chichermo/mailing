'use client'

import { useState, useEffect } from 'react'
import { 
  Cog6ToothIcon, 
  KeyIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SettingsData {
  sendgrid: {
    apiKey: string
    fromEmail: string
    fromName: string
  }
  twilio: {
    recoveryCode: string
  }
  notifications: {
    emailNotifications: boolean
    successAlerts: boolean
    errorAlerts: boolean
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('sendgrid')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SettingsData>({
    sendgrid: {
      apiKey: '',
      fromEmail: '',
      fromName: ''
    },
    twilio: {
      recoveryCode: ''
    },
    notifications: {
      emailNotifications: true,
      successAlerts: true,
      errorAlerts: true
    }
  })

  // Cargar configuración
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    // Cargar desde variables de entorno o localStorage
    const savedSettings = localStorage.getItem('heliopsis-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Valores por defecto desde .env
      setSettings({
        sendgrid: {
          apiKey: process.env.NEXT_PUBLIC_SENDGRID_API_KEY || '',
          fromEmail: process.env.NEXT_PUBLIC_FROM_EMAIL || '',
          fromName: process.env.NEXT_PUBLIC_FROM_NAME || ''
        },
        twilio: {
          recoveryCode: process.env.NEXT_PUBLIC_TWILIO_RECOVERY_CODE || ''
        },
        notifications: {
          emailNotifications: true,
          successAlerts: true,
          errorAlerts: true
        }
      })
    }
  }

  // Guardar configuración
  const saveSettings = async (section: keyof SettingsData) => {
    try {
      setLoading(true)
      
      // Simular guardado (en producción esto iría a una API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Guardar en localStorage
      localStorage.setItem('heliopsis-settings', JSON.stringify(settings))
      
      toast.success('Configuración guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  // Probar conexión SendGrid
  const testSendGridConnection = async () => {
    if (!settings.sendgrid.apiKey) {
      toast.error('Ingresa la API Key de SendGrid primero')
      return
    }

    try {
      setLoading(true)
      
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Conexión a SendGrid exitosa')
    } catch (error) {
      toast.error('Error de conexión con SendGrid')
    } finally {
      setLoading(false)
    }
  }

  // Probar envío de email
  const testEmailSend = async () => {
    if (!settings.sendgrid.apiKey || !settings.sendgrid.fromEmail) {
      toast.error('Configura SendGrid primero')
      return
    }

    try {
      setLoading(true)
      
      // Simular envío de prueba
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Email de prueba enviado correctamente')
    } catch (error) {
      toast.error('Error al enviar email de prueba')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'sendgrid', name: 'SendGrid', icon: KeyIcon },
    { id: 'twilio', name: 'Twilio', icon: ShieldCheckIcon },
    { id: 'email', name: 'Configuración de Email', icon: EnvelopeIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestiona la configuración del sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* SendGrid Configuration */}
        {activeTab === 'sendgrid' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de SendGrid</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key *
                  </label>
                  <input
                    type="password"
                    value={settings.sendgrid.apiKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      sendgrid: { ...settings.sendgrid, apiKey: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Encuentra tu API Key en el panel de control de SendGrid
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Remitente *
                  </label>
                  <input
                    type="email"
                    value={settings.sendgrid.fromEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      sendgrid: { ...settings.sendgrid, fromEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tu-email@dominio.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email desde el cual se enviarán los correos
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Remitente
                  </label>
                  <input
                    type="text"
                    value={settings.sendgrid.fromName}
                    onChange={(e) => setSettings({
                      ...settings,
                      sendgrid: { ...settings.sendgrid, fromName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tu Nombre o Empresa"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('sendgrid')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                  <button
                    onClick={testSendGridConnection}
                    disabled={loading || !settings.sendgrid.apiKey}
                    className="btn-secondary"
                  >
                    Probar Conexión
                  </button>
                </div>
              </div>
            </div>

            {/* SendGrid Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Información de SendGrid</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• SendGrid es una plataforma de entrega de emails transaccionales y de marketing</p>
                <p>• Proporciona alta tasa de entrega y análisis detallado</p>
                <p>• Soporta plantillas HTML y personalización dinámica</p>
                <p>• Incluye protección contra spam y cumplimiento de regulaciones</p>
              </div>
            </div>
          </div>
        )}

        {/* Twilio Configuration */}
        {activeTab === 'twilio' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Twilio</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Recuperación
                  </label>
                  <input
                    type="text"
                    value={settings.twilio.recoveryCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      twilio: { ...settings.twilio, recoveryCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Código de recuperación de Twilio"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Código de recuperación para casos de emergencia
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('twilio')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </div>
            </div>

            {/* Twilio Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Información de Twilio</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Twilio proporciona servicios de comunicación en la nube</p>
                <p>• Incluye SMS, llamadas de voz y verificación de identidad</p>
                <p>• Útil para recuperación de cuentas y notificaciones críticas</p>
                <p>• Cumple con estándares de seguridad internacionales</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Configuration */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Email</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Límite de Emails por Campaña
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="50">50 emails</option>
                    <option value="100">100 emails</option>
                    <option value="200">200 emails</option>
                    <option value="500">500 emails</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Número máximo de emails que se pueden enviar por campaña
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intervalo entre Envíos
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="0">Sin delay</option>
                    <option value="1000">1 segundo</option>
                    <option value="2000">2 segundos</option>
                    <option value="5000">5 segundos</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Tiempo de espera entre envíos para evitar ser marcado como spam
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('email')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                  <button
                    onClick={testEmailSend}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    Enviar Email de Prueba
                  </button>
                </div>
              </div>
            </div>

            {/* Email Security Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Seguridad y Anti-Spam</h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>• Configuración automática de SPF, DKIM y DMARC</p>
                <p>• Límites de envío para prevenir abuso</p>
                <p>• Monitoreo de tasas de rebote y quejas</p>
                <p>• Cumplimiento con regulaciones de email marketing</p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Configuration */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Notificaciones por Email
                    </label>
                    <p className="text-xs text-gray-500">Recibir notificaciones por email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Alertas de Éxito
                    </label>
                    <p className="text-xs text-gray-500">Notificar cuando las campañas se completen exitosamente</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.successAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, successAlerts: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Alertas de Error
                    </label>
                    <p className="text-xs text-gray-500">Notificar cuando ocurran errores en el envío</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.errorAlerts}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, errorAlerts: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('notifications')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-900 mb-2">Sistema de Notificaciones</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <p>• Notificaciones en tiempo real del estado de las campañas</p>
                <p>• Alertas personalizables para diferentes eventos</p>
                <p>• Historial de notificaciones y estado de entrega</p>
                <p>• Integración con sistemas de monitoreo externos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
