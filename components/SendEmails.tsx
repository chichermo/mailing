'use client'

import { useState, useEffect } from 'react'
import { 
  PaperAirplaneIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  EyeIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EmailTemplate {
  id: number
  name: string
  subject: string
  content: string
  variables: string
}

interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  company: string
  listName: string
}

interface Campaign {
  id: number
  name: string
  template_id: number
  list_name: string
  subject: string
  total_sent: number
  success_count: number
  error_count: number
  status: 'draft' | 'sending' | 'sent' | 'failed'
  created_at: string
}

export default function SendEmails() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [selectedList, setSelectedList] = useState<string>('all')
  const [customSubject, setCustomSubject] = useState('')
  const [customContent, setCustomContent] = useState('')
  const [testMode, setTestMode] = useState(false)

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const [templatesRes, contactsRes, campaignsRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/contacts'),
        fetch('/api/email-history')
      ])

      const templatesData = await templatesRes.json()
      const contactsData = await contactsRes.json()
      const campaignsData = await campaignsRes.json()

      console.log('📊 Data loaded:', {
        templates: templatesData,
        contacts: contactsData,
        campaigns: campaignsData
      })

      if (templatesData.success) {
        setTemplates(templatesData.data)
        console.log('📋 Templates set:', templatesData.data)
        console.log('🔍 Template details:', templatesData.data.map((t: any) => ({ id: t.id, name: t.name, idType: typeof t.id })))
      }
      if (contactsData.success) {
        setContacts(contactsData.data)
        console.log('👥 Contacts set:', contactsData.data)
                console.log('🔍 Contact details:', contactsData.data.map((c: any) => ({
          id: c.id,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          listName: c.listName,
          list_name: c.list_name
        })))
        console.log('📝 Available lists:', Array.from(new Set(contactsData.data.map((c: any) => c.list_name || c.listName).filter(Boolean))))
      }
      if (campaignsData.success) {
        setCampaigns(campaignsData.data)
        console.log('📧 Campaigns set:', campaignsData.data)
      }
    } catch (error) {
      console.error('❌ Error loading data:', error)
      toast.error('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Send emails
  const handleSendEmails = async () => {
    console.log('🚀 Starting email send process:', {
      selectedTemplate,
      customSubject,
      customContent,
      selectedList
    })

    // Validate that we have either a template OR custom content
    if (!selectedTemplate && (!customSubject || !customContent)) {
      toast.error('Select a template or enter custom subject and content')
      return
    }

    // If template is selected, we need at least custom subject or content
    if (selectedTemplate && (!customSubject && !customContent)) {
      toast.error('Enter custom subject or content when using a template')
      return
    }

         if (testMode && contacts.filter(c => c.listName === selectedList || selectedList === 'all').length > 5) {
      toast.error('Test mode only allows maximum 5 emails')
      return
    }

    if (!confirm(`Are you sure you want to send ${testMode ? '5' : 'all'} emails?`)) {
      return
    }

    try {
      setSending(true)
      console.log('Sending emails with data:', {
        templateId: selectedTemplate,
        listName: selectedList,
        customSubject,
        customContent,
        testMode
      })

      const requestBody = {
        templateId: selectedTemplate || undefined,
        listName: selectedList,
        customSubject: customSubject || undefined,
        customContent: customContent || undefined,
        testMode
      }

      console.log('📤 Sending request body:', requestBody)

      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        toast.success(`Emails sent! ${result.data.successCount} successful, ${result.data.errorCount} failed`)
        setShowModal(false)
        resetForm()
        loadData()
      } else {
        toast.error(result.error || 'Error sending emails')
      }
    } catch (error) {
      console.error('Error in handleSendEmails:', error)
      toast.error('Connection error')
    } finally {
      setSending(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setSelectedTemplate(null)
    setSelectedList('all')
    setCustomSubject('')
    setCustomContent('')
    setTestMode(false)
  }

  // Open modal
  const openModal = () => {
    setShowModal(true)
    resetForm()
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  // Get selected template
  const getSelectedTemplate = () => {
    return templates.find(t => t.id === selectedTemplate)
  }

  // Get selected contacts
  const getSelectedContacts = () => {
    console.log('👥 Getting selected contacts:', { selectedList, contactsCount: contacts.length })
    
    if (selectedList === 'all') {
      const allContacts = contacts
      console.log('📋 All contacts selected:', allContacts.length)
      return allContacts
    }
    
         const filteredContacts = contacts.filter(c => c.listName === selectedList)
    console.log('📋 Filtered contacts for list:', selectedList, 'Count:', filteredContacts.length)
    return filteredContacts
  }

  // Get stats
  const getStats = () => {
    const totalContacts = contacts.length
    const totalTemplates = templates.length
    const totalCampaigns = campaigns.length
    const totalSent = campaigns.reduce((sum, c) => sum + c.total_sent, 0)
    const totalSuccess = campaigns.reduce((sum, c) => sum + c.success_count, 0)
    const totalErrors = campaigns.reduce((sum, c) => sum + c.error_count, 0)

    return { totalContacts, totalTemplates, totalCampaigns, totalSent, totalSuccess, totalErrors }
  }

  // Get campaign status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft', icon: DocumentTextIcon },
      sending: { color: 'bg-blue-100 text-blue-800', text: 'Sending', icon: PlayIcon },
      sent: { color: 'bg-success-100 text-success-800', text: 'Sent', icon: EyeIcon },
      failed: { color: 'bg-danger-100 text-danger-800', text: 'Failed', icon: PauseIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Debug info
  console.log('🔍 Component state:', {
    templates: templates.length,
    contacts: contacts.length,
    campaigns: campaigns.length,
    selectedTemplate,
    selectedList
  })

  const stats = getStats()
  const selectedContacts = getSelectedContacts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Send Emails</h1>
          <p className="text-gray-600">Create and manage email campaigns</p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary"
        >
          <PaperAirplaneIcon className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <UsersIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
          <div className="text-sm text-gray-600">Total Contacts</div>
        </div>
        
        <div className="card text-center">
          <DocumentTextIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</div>
          <div className="text-sm text-gray-600">Templates</div>
        </div>
        
        <div className="card text-center">
          <PaperAirplaneIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</div>
          <div className="text-sm text-gray-600">Campaigns</div>
        </div>
        
        <div className="card text-center">
          <EyeIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalSuccess}</div>
          <div className="text-sm text-gray-600">Emails Sent</div>
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h2>
        
        {campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    List
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.slice(0, 5).map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                       {campaign.listName || 'All'}
                     </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status || 'draft')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">{campaign.success_count}</span>
                        <span className="text-gray-400">/</span>
                        <span>{campaign.total_sent}</span>
                        {campaign.error_count > 0 && (
                          <>
                            <span className="text-gray-400">/</span>
                            <span className="text-red-600">{campaign.error_count}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No campaigns created yet</div>
          </div>
        )}
      </div>

      {/* Modal for new campaign */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Email Campaign</h2>
            
            <div className="space-y-6">
              {/* Test mode */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="testMode"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
                  Test mode (maximum 5 emails)
                </label>
              </div>

              {/* Template selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Template
                </label>
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    console.log('🔄 Template selection changed:', { value, type: typeof value })
                    if (value && value !== '') {
                      const numValue = Number(value)
                      console.log('🔄 Converting to number:', { value, numValue, isNaN: isNaN(numValue) })
                      if (!isNaN(numValue)) {
                        setSelectedTemplate(numValue)
                      } else {
                        console.error('❌ Invalid template ID:', value)
                        setSelectedTemplate(null)
                      }
                    } else {
                      setSelectedTemplate(null)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">-- No template (custom content) --</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* List selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact List
                </label>
                <select
                  value={selectedList}
                  onChange={(e) => {
                    console.log('🔄 List selection changed:', { value: e.target.value, type: typeof e.target.value })
                    setSelectedList(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                                     <option value="all">All lists ({contacts.length} contacts)</option>
                   {Array.from(new Set(contacts.map(c => c.listName).filter(Boolean))).map(list => {
                     const count = contacts.filter(c => c.listName === list).length
                    console.log('🔍 Creating list option:', { list, count, value: list })
                    return (
                      <option key={list} value={list}>
                        {list} ({count} contacts)
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Template preview */}
              {selectedTemplate && getSelectedTemplate() && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Template preview:</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Subject:</span>
                      <p className="text-sm font-medium">{getSelectedTemplate()?.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Content:</span>
                      <div className="text-sm text-gray-700 line-clamp-3">
                        {getSelectedTemplate()?.content.replace(/<[^>]*>/g, '')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom content */}
              {!selectedTemplate && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your email subject..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HTML Content *
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                      placeholder="<h1>Hello!</h1><p>Your email content...</p>"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can use HTML and variables like {'{firstName}'}, {'{lastName}'}, {'{company}'}
                    </p>
                  </div>
                </>
              )}

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Campaign summary:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>• Contacts to send: {selectedContacts.length}</div>
                  <div>• Mode: {testMode ? 'Test (max. 5)' : 'Production'}</div>
                  {selectedTemplate && (
                    <div>• Template: {getSelectedTemplate()?.name}</div>
                  )}
                  {!selectedTemplate && (
                    <div>• Type: Custom content</div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSendEmails}
                  disabled={sending || (!selectedTemplate && (!customSubject || !customContent))}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4 mr-2" />
                      {testMode ? 'Send Test' : 'Send Campaign'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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
