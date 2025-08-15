'use client'

import { useState } from 'react'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  PaperAirplaneIcon, 
  ClockIcon, 
  Cog6ToothIcon,
  ChartBarIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { name: 'Dashboard', href: 'dashboard', icon: HomeIcon },
  { name: 'Contacts', href: 'contacts', icon: UsersIcon },
  { name: 'Templates', href: 'templates', icon: DocumentTextIcon },
  { name: 'Send Emails', href: 'send-emails', icon: PaperAirplaneIcon },
  { name: 'History', href: 'history', icon: ClockIcon },
  { name: 'Dance Stats', href: 'dance-stats', icon: ChartBarIcon },
  { name: 'Editor Demo', href: 'editor-demo', icon: PencilSquareIcon },
  { name: 'Settings', href: 'settings', icon: Cog6ToothIcon },
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-gray-900">Heliopsis Mail</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">Email Marketing System</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = activeTab === item.href
            return (
              <li key={item.name}>
                <button
                  onClick={() => onTabChange(item.href)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">Powered by Next.js & SendGrid</p>
        </div>
      </div>
    </div>
  )
}
