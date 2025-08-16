
'use client'

import { 
  EnvelopeIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your email marketing system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <UsersIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </div>
        
        <div className="card text-center">
          <EnvelopeIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Email Templates</div>
        </div>
        
        <div className="card text-center">
          <EnvelopeIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Campaigns</div>
        </div>
        
        <div className="card text-center">
          <CheckCircleIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-600">Emails Sent</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('send-emails')}
              className="w-full btn-primary"
            >
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Send New Campaign
            </button>
            <button 
              onClick={() => handleQuickAction('contacts')}
              className="w-full btn-secondary"
            >
              <UsersIcon className="w-4 h-4 mr-2" />
              Add Contacts
            </button>
            <button 
              onClick={() => handleQuickAction('templates')}
              className="w-full btn-secondary"
            >
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SendGrid</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                Pending
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Twilio</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-800">
                <ExclamationTriangleIcon className="w-3 h3 mr-1" />
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Test API Component */}
      <TestAPI />

      {/* Email Test Component */}
      <EmailTest />

      {/* System Status Component */}
      <SystemStatus />
    </div>
  )
}
