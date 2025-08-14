'use client'

import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  EnvelopeIcon, 
  ListBulletIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Contact {
  _id: string
  firstName: string
  lastName: string
  email: string
  listNames: string[]
}

interface ListStats {
  name: string
  count: number
  contacts: Contact[]
}

export default function DanceListStats() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [listStats, setListStats] = useState<ListStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts')
      const result = await response.json()
      
      if (result.success) {
        setContacts(result.data)
        calculateListStats(result.data)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateListStats = (contactsData: Contact[]) => {
    const listMap = new Map<string, Contact[]>()
    
    // Agrupar contactos por lista
    contactsData.forEach(contact => {
      if (contact.listNames) {
        contact.listNames.forEach(listName => {
          if (!listMap.has(listName)) {
            listMap.set(listName, [])
          }
          listMap.get(listName)!.push(contact)
        })
      }
    })

    // Convertir a array y ordenar por cantidad de contactos
    const stats = Array.from(listMap.entries())
      .map(([name, contacts]) => ({
        name,
        count: contacts.length,
        contacts
      }))
      .sort((a, b) => b.count - a.count)

    setListStats(stats)
  }

  const getTotalUniqueContacts = () => {
    const uniqueEmails = new Set(contacts.map(c => c.email))
    return uniqueEmails.size
  }

  const getTotalLists = () => {
    return listStats.length
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contactos</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalUniqueContacts()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ListBulletIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Listas</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalLists()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Emails</p>
              <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas por lista */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Estadísticas por Lista
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porcentaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listStats.map((list, index) => {
                const percentage = ((list.count / getTotalUniqueContacts()) * 100).toFixed(1)
                return (
                  <tr key={list.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          index < 3 ? 'bg-blue-500' : 
                          index < 6 ? 'bg-green-500' : 
                          index < 9 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900">{list.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{list.count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <details className="cursor-pointer">
                        <summary className="hover:text-blue-600">Ver contactos</summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          {list.contacts.slice(0, 5).map(contact => (
                            <div key={contact._id} className="mb-1">
                              {contact.firstName} {contact.lastName} ({contact.email})
                            </div>
                          ))}
                          {list.contacts.length > 5 && (
                            <div className="text-gray-400 italic">
                              ... y {list.contacts.length - 5} más
                            </div>
                          )}
                        </div>
                      </details>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
