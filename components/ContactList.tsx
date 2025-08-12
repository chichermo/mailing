'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  company: string
  phone: string
  list_name: string
  created_at: string
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  listName: string
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterList, setFilterList] = useState('all')
  const [bulkContacts, setBulkContacts] = useState('')
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    listName: 'General'
  })

  // Load contacts
  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts')
      const result = await response.json()
      
      if (result.success) {
        setContacts(result.data)
      } else {
        toast.error('Error loading contacts')
      }
    } catch (error) {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  // Create/Edit contact
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.email) {
      toast.error('First name and email are required')
      return
    }

    try {
      const url = '/api/contacts'
      const method = editingContact ? 'PUT' : 'POST'
      const body = editingContact 
        ? { ...formData, id: editingContact.id }
        : formData

      console.log('Sending request:', { method, url, body })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        toast.success(editingContact ? 'Contact updated' : 'Contact created')
        setShowModal(false)
        setEditingContact(null)
        resetForm()
        loadContacts()
      } else {
        toast.error(result.error || 'Error saving contact')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Connection error')
    }
  }

  // Bulk import contacts from text
  const handleBulkImport = async () => {
    if (!bulkContacts.trim()) {
      toast.error('Please enter contact information')
      return
    }

    try {
      const lines = bulkContacts.trim().split('\n')
      const contactsToAdd = []
      
      for (const line of lines) {
        if (line.trim()) {
          const parts = line.split(',').map(part => part.trim())
          if (parts.length >= 2) {
            contactsToAdd.push({
              firstName: parts[0] || '',
              lastName: parts[1] || '',
              email: parts[2] || '',
              company: parts[3] || '',
              phone: parts[4] || '',
              listName: 'General'
            })
          }
        }
      }

      if (contactsToAdd.length === 0) {
        toast.error('No valid contacts found. Format: First Name, Last Name, Email, Company, Phone')
        return
      }

      // Add contacts one by one
      let successCount = 0
      for (const contact of contactsToAdd) {
        try {
          const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
          })
          
          if (response.ok) {
            successCount++
          }
        } catch (error) {
          console.error('Error adding contact:', error)
        }
      }

      toast.success(`Successfully added ${successCount} out of ${contactsToAdd.length} contacts`)
      setShowBulkImport(false)
      setBulkContacts('')
      loadContacts()
    } catch (error) {
      toast.error('Error importing contacts')
    }
  }

  // Delete contact
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Contact deleted')
        loadContacts()
      } else {
        toast.error('Error deleting contact')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  // Edit contact
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      firstName: contact.first_name,
      lastName: contact.last_name || '',
      email: contact.email,
      company: contact.company || '',
      phone: contact.phone || '',
      listName: contact.list_name || 'General'
    })
    setShowModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
      listName: 'General'
    })
  }

  // Open modal for new contact
  const openNewContactModal = () => {
    setEditingContact(null)
    resetForm()
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingContact(null)
    resetForm()
  }

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesList = filterList === 'all' || contact.list_name === filterList

    return matchesSearch && matchesList
  })

  // Get unique lists
  const uniqueLists = ['all', ...Array.from(new Set(contacts.map(c => c.list_name)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact List</h1>
          <p className="text-gray-600">Manage your contact database</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkImport(true)}
            className="btn-secondary"
          >
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
            Bulk Import
          </button>
          <button
            onClick={openNewContactModal}
            className="btn-primary"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Contact
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterList}
            onChange={(e) => setFilterList(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            {uniqueLists.map(list => (
              <option key={list} value={list}>
                {list === 'all' ? 'All Lists' : list}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  List
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </div>
                      {contact.phone && (
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {contact.list_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || filterList !== 'all' 
                ? 'No contacts found with applied filters'
                : 'No contacts registered yet'
              }
            </div>
          </div>
        )}
      </div>

      {/* Modal for create/edit contact */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingContact ? 'Edit Contact' : 'New Contact'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  List
                </label>
                <input
                  type="text"
                  value={formData.listName}
                  onChange={(e) => setFormData({...formData, listName: e.target.value})}
                  placeholder="General"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingContact ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">Bulk Import Contacts</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information (One per line)
                </label>
                <textarea
                  rows={10}
                  value={bulkContacts}
                  onChange={(e) => setBulkContacts(e.target.value)}
                  placeholder="John, Doe, john@example.com, Company Inc, +1234567890&#10;Jane, Smith, jane@example.com, Another Corp, +0987654321&#10;Mike, Johnson, mike@example.com, Tech LLC, +1122334455"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: First Name, Last Name, Email, Company, Phone (separated by commas)
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Example:</h4>
                <div className="text-sm text-blue-800 font-mono">
                  John, Doe, john@example.com, Company Inc, +1234567890<br/>
                  Jane, Smith, jane@example.com, Another Corp, +0987654321
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBulkImport}
                  className="flex-1 btn-primary"
                >
                  Import Contacts
                </button>
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
