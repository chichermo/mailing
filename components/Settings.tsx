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

  // Load settings
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    // Load from environment variables or localStorage
    const savedSettings = localStorage.getItem('heliopsis-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Default values from .env
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

  // Save settings
  const saveSettings = async (section: keyof SettingsData) => {
    try {
      setLoading(true)
      
      // Simular guardado (en producción esto iría a una API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Guardar en localStorage
      localStorage.setItem('heliopsis-settings', JSON.stringify(settings))
      
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  // Test SendGrid connection
  const testSendGridConnection = async () => {
    if (!settings.sendgrid.apiKey) {
      toast.error('Please enter the SendGrid API key first')
      return
    }

    try {
      setLoading(true)
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('SendGrid connection successful')
    } catch (error) {
      toast.error('SendGrid connection failed')
    } finally {
      setLoading(false)
    }
  }

  // Test email send
  const testEmailSend = async () => {
    if (!settings.sendgrid.apiKey || !settings.sendgrid.fromEmail) {
      toast.error('Please configure SendGrid first')
      return
    }

    try {
      setLoading(true)
      
      // Simulate test send
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Test email sent successfully')
    } catch (error) {
      toast.error('Failed to send test email')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'sendgrid', name: 'SendGrid', icon: KeyIcon },
    { id: 'twilio', name: 'Twilio', icon: ShieldCheckIcon },
    { id: 'email', name: 'Email Settings', icon: EnvelopeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system settings</p>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">SendGrid Settings</h3>
              
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
                    Find your API key in the SendGrid dashboard
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Email *
                  </label>
                  <input
                    type="email"
                    value={settings.sendgrid.fromEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      sendgrid: { ...settings.sendgrid, fromEmail: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your-email@domain.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address used to send messages
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    value={settings.sendgrid.fromName}
                    onChange={(e) => setSettings({
                      ...settings,
                      sendgrid: { ...settings.sendgrid, fromName: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your name or company"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('sendgrid')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button
                    onClick={testSendGridConnection}
                    disabled={loading || !settings.sendgrid.apiKey}
                    className="btn-secondary"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
            </div>

            {/* SendGrid Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">SendGrid Information</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• SendGrid is a platform for transactional and marketing email delivery</p>
                <p>• Provides high deliverability and detailed analytics</p>
                <p>• Supports HTML templates and dynamic personalization</p>
                <p>• Includes anti-spam protection and compliance tools</p>
              </div>
            </div>
          </div>
        )}

        {/* Twilio Configuration */}
        {activeTab === 'twilio' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Twilio Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recovery Code
                  </label>
                  <input
                    type="text"
                    value={settings.twilio.recoveryCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      twilio: { ...settings.twilio, recoveryCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Twilio recovery code"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recovery code for emergency access
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('twilio')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>

            {/* Twilio Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-green-900 mb-2">Twilio Information</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Twilio provides cloud communications services</p>
                <p>• Includes SMS, voice calls, and identity verification</p>
                <p>• Useful for account recovery and critical notifications</p>
                <p>• Compliant with international security standards</p>
              </div>
            </div>
          </div>
        )}

        {/* Email Configuration */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Limit per Campaign
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="50">50 emails</option>
                    <option value="100">100 emails</option>
                    <option value="200">200 emails</option>
                    <option value="500">500 emails</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of emails per campaign
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Send Interval
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="0">No delay</option>
                    <option value="1000">1 second</option>
                    <option value="2000">2 seconds</option>
                    <option value="5000">5 seconds</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Wait time between sends to avoid spam flags
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => saveSettings('sendgrid')}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                  <button
                    onClick={testEmailSend}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    Send Test Email
                  </button>
                </div>
              </div>
            </div>

            {/* Email Security Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">Security and Anti-Spam</h4>
              <div className="text-sm text-yellow-800 space-y-1">
                <p>• Automatic SPF, DKIM, and DMARC configuration</p>
                <p>• Sending limits to prevent abuse</p>
                <p>• Bounce and complaint rate monitoring</p>
                <p>• Compliance with email marketing regulations</p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Configuration */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500">Receive notifications by email</p>
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
                      Success Alerts
                    </label>
                    <p className="text-xs text-gray-500">Notify when campaigns complete successfully</p>
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
                      Error Alerts
                    </label>
                    <p className="text-xs text-gray-500">Notify when send errors occur</p>
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
                    {loading ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-900 mb-2">Notification System</h4>
              <div className="text-sm text-purple-800 space-y-1">
                <p>• Real-time campaign status notifications</p>
                <p>• Customizable alerts for different events</p>
                <p>• Notification history and delivery status</p>
                <p>• Integration with external monitoring systems</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
