
'use client'

import { useState, useEffect } from 'react'
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

interface ContactStats {
  total: number
  templates: number
  campaigns: number
  emailsSent: number
}

export default function Dashboard({ onTabChange }: DashboardProps) {
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    templates: 0,
    campaigns: 0,
    emailsSent: 0
  })
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [resetting, setResetting] = useState(false)

  const loadStats = async () => {
    try {
      setLoading(true)
      
      const contactsResponse = await fetch('/api/contacts')
      const contactsResult = await contactsResponse.json()

      if (contactsResult.success) {
        const totalContacts = contactsResult.data.length
        setStats(prev => ({
          ...prev,
          total: totalContacts
        }))
      } else {
        console.error('Failed to load contacts:', contactsResult.error)
      }
      
      // TODO: Load other stats when APIs are implemented
      // const templatesResponse = await fetch('/api/templates')
      // const campaignsResponse = await fetch('/api/campaigns')
      // const emailsResponse = await fetch('/api/emails')
      
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const importDanceEmails = async () => {
    try {
      setImporting(true)
      
      const response = await fetch('/api/import-dance-emails', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Reload stats to show updated contact count
        await loadStats()
        alert(`Import completed successfully!\n${result.message}`)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setImporting(false)
    }
  }

  const importOrganizedContacts = async () => {
    try {
      setImporting(true)
      
      const response = await fetch('/api/import-organized-contacts', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Reload stats to show updated contact count
        await loadStats()
        alert(`✅ Import organized contacts completed!\n\n${result.message}\n\nThis should give you all ${result.summary.totalLines} contacts from the organized file.`)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Organized import error:', error)
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setImporting(false)
    }
  }

  const resetDatabase = async () => {
    if (!confirm('⚠️ Are you sure you want to delete ALL contacts from the database?\n\nThis allows a clean import from scratch.')) {
      return
    }

    try {
      setResetting(true)
      
      const response = await fetch('/api/reset-contacts', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        await loadStats()
        alert(`✅ Database reset completed!\n\nDeleted ${result.deletedCount} contacts.\n\nYou can now run the import to restore contacts.`)
      } else {
        alert(`❌ Failed to reset the database: ${result.error}`)
      }
    } catch (error) {
      console.error('Database reset error:', error)
      alert(`❌ Failed to reset the database: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setResetting(false)
    }
  }

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
          Welcome to your professional email marketing system. Monitor performance and manage your campaigns from one place.
        </p>
      </div>

      {/* Quick Stats mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : stats.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Contacts</div>
            <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {loading ? 'Loading...' : 'In Database'}
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <EnvelopeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : stats.templates.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Templates</div>
            <div className="mt-3 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {loading ? 'Loading...' : 'Available'}
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : stats.campaigns.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Campaigns</div>
            <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {loading ? 'Loading...' : 'Created'}
            </div>
          </div>
        </div>
        
        <div className="card card-hover group">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : stats.emailsSent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Emails Sent</div>
            <div className="mt-3 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              {loading ? 'Loading...' : 'Delivered'}
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
              <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => handleQuickAction('send-emails')}
                className="w-full btn-primary group"
              >
                <EnvelopeIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Create New Campaign
              </button>
              <button 
                onClick={() => handleQuickAction('contacts')}
                className="w-full btn-secondary group"
              >
                <UsersIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Add Contacts
              </button>
              <button 
                onClick={() => handleQuickAction('templates')}
                className="w-full btn-secondary group"
              >
                <EnvelopeIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Create Template
              </button>
              <button 
                onClick={importDanceEmails}
                className="w-full btn-success group"
                disabled={importing}
              >
                {importing ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                    Import Dance Emails
                  </>
                )}
              </button>
              <button 
                onClick={importOrganizedContacts}
                className="w-full btn-primary group"
                disabled={importing}
              >
                {importing ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200">📋</div>
                    Import Organized Contacts
                  </>
                )}
              </button>
              <button 
                onClick={resetDatabase}
                className="w-full btn-danger group"
                disabled={resetting}
              >
                {resetting ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Reseteando...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200">🗑️</div>
                    Reset Database
                  </>
                )}
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
              <h3 className="text-xl font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-xl border border-success-200">
                <span className="text-sm font-medium text-gray-700">Database</span>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-700">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                <span className="text-sm font-medium text-gray-700">SendGrid</span>
                <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                  <span className="text-sm font-medium text-gray-700">SendGrid</span>
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
                    <span className="text-sm font-medium text-warning-700">Pending</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-xl border border-warning-200">
                <span className="text-sm font-medium text-gray-700">Twilio</span>
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-warning-600" />
                  <span className="text-sm font-medium text-warning-700">Pending</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={() => handleQuickAction('settings')}
                className="w-full btn-ghost text-sm"
              >
                Configure Services →
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
              <h3 className="text-xl font-semibold text-gray-900">API Testing</h3>
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
              <h3 className="text-xl font-semibold text-gray-900">Email Testing</h3>
            </div>
            <EmailTest />
          </div>
        </div>
      </div>

      {/* Footer del Dashboard */}
      <div className="text-center py-8">
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm">Heliopsis Mail - Professional Email Marketing System</span>
        </div>
      </div>
    </div>
  )
}
