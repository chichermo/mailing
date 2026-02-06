'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import ContactList from '../components/ContactList'
import EmailTemplates from '../components/EmailTemplates'
import SendEmails from '../components/SendEmails'
import EmailHistory from '../components/EmailHistory'
import DanceListStats from '../components/DanceListStats'
import Settings from '../components/Settings'
import WorkingEditor from '../components/WorkingEditor'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

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
      case 'dance-stats':
        return <DanceListStats />
      case 'editor-demo':
        return <WorkingEditor value="" onChange={() => {}} />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="app-container flex min-h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  )
}
