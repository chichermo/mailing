'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import ContactList from '../components/ContactList'
import EmailTemplates from '../components/EmailTemplates'
import SendEmails from '../components/SendEmails'
import EmailHistory from '../components/EmailHistory'
import Settings from '../components/Settings'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Initialize database when component mounts
  // Force redeploy to recognize MONGODB_URI environment variable
  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('🔄 Initializing database...')
        const response = await fetch('/api/init-db')
        const result = await response.json()
        
        if (result.success) {
          console.log('✅ Database initialized successfully')
        } else {
          console.error('❌ Failed to initialize database:', result.error)
        }
      } catch (error) {
        console.error('❌ Error initializing database:', error)
      }
    }

    initDatabase()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />
      case 'contacts':
        return <ContactList />
      case 'templates':
        return <EmailTemplates />
      case 'send-emails':
        return <SendEmails />
      case 'history':
        return <EmailHistory />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  )
}
