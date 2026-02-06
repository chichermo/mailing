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
  _id: string
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  listNames: string[] // Cambiado de listName a listNames (array)
  createdAt: string
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  listNames: string[] // Cambiado de listName a listNames (array)
}

type BulkParseResult = { contacts: ContactFormData[] } | { error: string } | null

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showListManager, setShowListManager] = useState(false) // Nuevo modal para gestión de listas
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterList, setFilterList] = useState('all')
  const [bulkContacts, setBulkContacts] = useState('')
  const [bulkImporting, setBulkImporting] = useState(false)
  
  // Estados para selección múltiple
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [availableLists, setAvailableLists] = useState<string[]>([])
  
  // Estados para selección con Shift
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1)
  
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    listNames: ['General'] // Cambiado a array
  })

  // Load contacts
  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contacts')
      const result = await response.json()
      
      if (result.success) {
        setContacts(result.data)
        // Extraer listas únicas disponibles
        const allLists = result.data.flatMap((c: Contact) => c.listNames || [])
        setAvailableLists(Array.from(new Set(allLists)))
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

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔍 selectedContacts changed:', selectedContacts)
    console.log('🔍 selectAll changed:', selectAll)
  }, [selectedContacts, selectAll])

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
        ? { ...formData, id: editingContact._id }
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

  const extractName = (text: string) => {
    const cleaned = text
      .replace(/[<>()[\]]/g, ' ')
      .replace(/[-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleaned) {
      return { firstName: 'Imported', lastName: '' }
    }

    if (cleaned.includes(',')) {
      const [last, first] = cleaned.split(',').map(part => part.trim())
      const firstParts = (first || '').split(' ').filter(Boolean)
      const lastParts = (last || '').split(' ').filter(Boolean)
      return {
        firstName: firstParts[0] || 'Imported',
        lastName: [...firstParts.slice(1), ...lastParts].join(' ').trim()
      }
    }

    const parts = cleaned.split(' ').filter(Boolean)
    return {
      firstName: parts[0] || 'Imported',
      lastName: parts.slice(1).join(' ')
    }
  }

  const parseBulkLine = (line: string, lineNumber: number): BulkParseResult => {
    const raw = line.trim()
    if (!raw) return null

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const segments = raw
      .split(/[;|]/)
      .map(segment => segment.trim())
      .filter(Boolean)

    const contacts: ContactFormData[] = []

    segments.forEach((segment) => {
      const emails = segment.match(emailRegex) || []
      if (emails.length === 0) {
        return
      }

      const nameSource = segment.replace(emailRegex, ' ').trim()
      const { firstName, lastName } = extractName(nameSource)

      emails.forEach((email) => {
        const normalizedEmail = email.toLowerCase()
        contacts.push({
          firstName,
          lastName,
          email: normalizedEmail,
          company: '',
          phone: '',
          listNames: ['General']
        })
      })
    })

    if (contacts.length === 0) {
      return { error: `Line ${lineNumber}: email not found` }
    }

    return { contacts }
  }

  // Bulk import contacts from text
  const handleBulkImport = async () => {
    if (!bulkContacts.trim()) {
      toast.error('Please enter contact information')
      return
    }

    setBulkImporting(true)
    try {
      const lines = bulkContacts.trim().split('\n')
      const contactsToAdd: ContactFormData[] = []
      const parseErrors: string[] = []
      const seenEmails = new Set<string>()

      lines.forEach((line, index) => {
        const parsed = parseBulkLine(line, index + 1)
        if (!parsed) return
        if ('error' in parsed) {
          parseErrors.push(parsed.error || 'Unknown error')
          return
        }
        parsed.contacts.forEach((contact) => {
          const email = contact.email.toLowerCase()
          if (seenEmails.has(email)) {
            parseErrors.push(`Line ${index + 1}: duplicate email in import`)
            return
          }
          seenEmails.add(email)
          contactsToAdd.push(contact)
        })
      })

      if (parseErrors.length > 0) {
        console.warn('Bulk import skipped lines:', parseErrors)
        toast.error(`Skipped ${parseErrors.length} line(s) with errors`)
      }

      if (contactsToAdd.length === 0) {
        toast.error('No valid contacts found to import')
        return
      }

      let successCount = 0
      let errorCount = 0

      for (const contact of contactsToAdd) {
        try {
          const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
            const result = await response.json()
            console.error('Error adding contact:', result.error || result)
          }
        } catch (error) {
          errorCount++
          console.error('Error adding contact:', error)
        }
      }

      if (errorCount > 0) {
        toast.error(`Imported ${successCount} of ${contactsToAdd.length}. ${errorCount} failed.`)
      } else {
        toast.success(`Imported ${successCount} contacts successfully`)
      }

      setShowBulkImport(false)
      setBulkContacts('')
      loadContacts()
    } catch (error) {
      toast.error('Error importing contacts')
    } finally {
      setBulkImporting(false)
    }
  }

  // Delete contact
  const handleDelete = async (id: string) => {
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
      firstName: contact.firstName,
      lastName: contact.lastName || '',
      email: contact.email,
      company: contact.company || '',
      phone: contact.phone || '',
      listNames: contact.listNames || ['General']
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
      listNames: ['General']
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
      (contact.firstName && contact.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
            const matchesList = filterList === 'all' || (contact.listNames && Array.isArray(contact.listNames) && contact.listNames.includes(filterList))

    return matchesSearch && matchesList
  })

  // Get unique lists
  const uniqueLists = ['all', ...Array.from(new Set(contacts.flatMap(c => c.listNames)))]

  // Sincronizar selectAll cuando cambien los filtros
  useEffect(() => {
    // Si no hay contactos filtrados, desmarcar selectAll
    if (filteredContacts.length === 0) {
      setSelectAll(false)
      return
    }
    
    // Verificar si todos los contactos filtrados están seleccionados
    const allFilteredSelected = filteredContacts.every(contact => 
      selectedContacts.has(contact._id)
    )
    
    // Solo actualizar si es diferente para evitar loops infinitos
    if (allFilteredSelected !== selectAll) {
      setSelectAll(allFilteredSelected)
    }
  }, [filteredContacts, selectedContacts, selectAll])

  // Funciones para selección múltiple
  const handleSelectContact = (contactId: string, event: React.MouseEvent, index: number) => {
    console.log('🔍 handleSelectContact called with:', contactId, 'index:', index)
    console.log('🔍 Current selectedContacts:', selectedContacts)
    
    const newSelected = new Set(selectedContacts)
    
    // Si se presiona Shift, seleccionar rango
    if (event.shiftKey && lastSelectedIndex !== -1) {
      const startIndex = Math.min(lastSelectedIndex, index)
      const endIndex = Math.max(lastSelectedIndex, index)
      
      console.log(`🔍 Shift selection: from ${startIndex} to ${endIndex}`)
      
      // Seleccionar todos los contactos en el rango
      for (let i = startIndex; i <= endIndex; i++) {
        if (filteredContacts[i]) {
          newSelected.add(filteredContacts[i]._id)
        }
      }
    } else {
      // Selección normal (click individual)
      if (newSelected.has(contactId)) {
        newSelected.delete(contactId)
        console.log('🔍 Removed contact:', contactId)
      } else {
        newSelected.add(contactId)
        console.log('🔍 Added contact:', contactId)
      }
    }
    
    // Actualizar el último índice seleccionado
    setLastSelectedIndex(index)
    
    console.log('🔍 New selectedContacts:', newSelected)
    setSelectedContacts(newSelected)
    setSelectAll(newSelected.size === filteredContacts.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContacts(new Set())
      setSelectAll(false)
    } else {
      // Solo seleccionar los contactos filtrados, no todos los contactos
      setSelectedContacts(new Set(filteredContacts.map(c => c._id)))
      setSelectAll(true)
    }
  }

  const handleMoveToList = async (targetList: string) => {
    if (targetList === '__new__') {
      setShowListManager(true)
      return
    }

    if (selectedContacts.size === 0) {
      toast.error('No contacts selected')
      return
    }

    try {
      const response = await fetch('/api/contacts/move-to-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds: Array.from(selectedContacts),
          targetList
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Moved ${selectedContacts.size} contacts to ${targetList}`)
        setSelectedContacts(new Set())
        setSelectAll(false)
        loadContacts()
      } else {
        toast.error(result.error || 'Error moving contacts')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  const handleRemoveFromList = async (targetList: string) => {
    if (selectedContacts.size === 0) {
      toast.error('No contacts selected')
      return
    }

    try {
      const response = await fetch('/api/contacts/remove-from-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds: Array.from(selectedContacts),
          targetList
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Removed ${selectedContacts.size} contacts from ${targetList}`)
        setSelectedContacts(new Set())
        setSelectAll(false)
        loadContacts()
      } else {
        toast.error(result.error || 'Error removing contacts from list')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedContacts.size === 0) {
      toast.error('No contacts selected')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedContacts.size} contacts?`)) return

    try {
      const response = await fetch('/api/contacts/delete-multiple', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIds: Array.from(selectedContacts)
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Deleted ${selectedContacts.size} contacts`)
        setSelectedContacts(new Set())
        setSelectAll(false)
        loadContacts()
      } else {
        toast.error(result.error || 'Error deleting contacts')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  // Función para migrar contactos existentes
  const handleMigrateContacts = async () => {
    try {
      const response = await fetch('/api/migrate-contacts', {
        method: 'POST'
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        loadContacts() // Recargar contactos después de la migración
      } else {
        toast.error(result.error || 'Error during migration')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  // Función para importar listas de danza
  const handleImportDanceLists = async () => {
    if (!confirm('Are you sure you want to import all dance lists? This will create/update many contacts.')) {
      return
    }

    try {
      toast.loading('Importing dance lists...', { id: 'dance-import' })
      
      const response = await fetch('/api/import-dance-emails', {
        method: 'POST'
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`${result.message}`, { id: 'dance-import' })
        toast.success(`Summary: ${result.summary.totalFiles} files, ${result.summary.totalImported} contacts, ${result.summary.totalErrors} errors`)
        loadContacts() // Recargar contactos para reflejar las nuevas listas
      } else {
        toast.error(result.error || 'Error importing dance lists', { id: 'dance-import' })
      }
    } catch (error) {
      toast.error('Connection error', { id: 'dance-import' })
    }
  }

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
          <p className="text-gray-600">
            Manage your contact database • <span className="font-semibold text-primary-600">{contacts.length.toLocaleString()} contacts</span>
            {loading && <span className="ml-2 text-yellow-600">(Loading...)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadContacts}
            disabled={loading}
            className="btn-secondary"
          >
            <div className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}>
              {loading ? '⟳' : '↻'}
            </div>
            Refresh
          </button>
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Contact
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <ClipboardDocumentIcon className="w-5 h-5" />
            Bulk Import
          </button>
          <button
            onClick={handleMigrateContacts}
            className="btn-secondary flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
          >
            🔄 Migrate
          </button>
          <button
            onClick={handleImportDanceLists}
            className="btn-secondary flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            🎭 Import Dance Lists
          </button>
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
          {/* Indicador de selección con Shift */}
          {selectedContacts.size === 0 && (
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-2">
              <div className="text-xs text-gray-600 text-center">
                💡 <strong>Tip:</strong> Hold <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift</kbd> + Click to select multiple contacts at once
              </div>
            </div>
          )}
          
          {/* Barra de acciones en lote */}
          {selectedContacts.size > 0 && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-900">
                  <span className="font-medium">{selectedContacts.size}</span> contact{selectedContacts.size !== 1 ? 's' : ''} selected
                  <span className="text-blue-600 ml-2">
                    (of {filteredContacts.length} filtered)
                  </span>
                </div>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleMoveToList(e.target.value)
                    }
                  }}
                  className="px-3 py-1 text-sm border border-blue-300 rounded-md bg-white text-blue-900"
                  defaultValue=""
                >
                  <option value="">Move to list...</option>
                  {availableLists.map(list => (
                    <option key={list} value={list}>{list}</option>
                  ))}
                  <option value="__new__">+ Create new list</option>
                </select>
                
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleRemoveFromList(e.target.value)
                    }
                  }}
                  className="px-3 py-1 text-sm border border-orange-300 rounded-md bg-white text-orange-900"
                  defaultValue=""
                >
                  <option value="">Remove from list...</option>
                  {availableLists.map(list => (
                    <option key={list} value={list}>{list}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    setSelectedContacts(new Set())
                    setSelectAll(false)
                  }}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Clear Selection
                </button>
                
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
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
                  Lists
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                      <span className="text-gray-500">Loading contacts...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || filterList !== 'all' 
                        ? 'No contacts found with applied filters'
                        : 'No contacts registered yet'
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <input
                         type="checkbox"
                         checked={selectedContacts.has(contact._id)}
                         onClick={(e) => handleSelectContact(contact._id, e, filteredContacts.findIndex(c => c._id === contact._id))}
                         className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                       />
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
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
                      <div className="flex flex-wrap gap-1">
                        {contact.listNames && contact.listNames.length > 0 ? (
                          contact.listNames.map((list, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {list}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">No lists</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(contact)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                  Lists
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                  {uniqueLists.map(list => (
                    <label key={list} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.listNames && Array.isArray(formData.listNames) && formData.listNames.includes(list)}
                        onChange={(e) => {
                          const newListNames = [...formData.listNames];
                          if (e.target.checked) {
                            newListNames.push(list);
                          } else {
                            newListNames.splice(newListNames.indexOf(list), 1);
                          }
                          setFormData({ ...formData, listNames: newListNames });
                        }}
                        className="mr-1"
                      />
                      {list === 'all' ? 'All Lists' : list}
                    </label>
                  ))}
                </div>
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
                  placeholder="John, Doe, john@example.com, Company Inc, +1234567890&#10;Jane, Smith, jane@example.com, Another Corp, +0987654321&#10;Mike Johnson - mike@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats: auto-detects names with emails in any order
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
                  disabled={bulkImporting}
                >
                  {bulkImporting ? 'Importing...' : 'Import Contacts'}
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

      {/* Create new list modal */}
      {showListManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Create New List</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., VIP Clients, Madrid Office, Marketing Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  id="newListName"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    const listName = (document.getElementById('newListName') as HTMLInputElement)?.value?.trim()
                    if (listName) {
                      handleMoveToList(listName)
                      setShowListManager(false)
                    } else {
                      toast.error('Please enter a list name')
                    }
                  }}
                  className="flex-1 btn-primary"
                >
                  Create List
                </button>
                <button
                  onClick={() => setShowListManager(false)}
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
