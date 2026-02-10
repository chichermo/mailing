'use client'

import { useState, useEffect } from 'react'
import { 
  PaperAirplaneIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  EyeIcon,
  PlayIcon,
  PauseIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import RichTextEditor from './RichTextEditor'

interface EmailTemplate {
  _id: string
  name: string
  subject: string
  content: string
  variables: string
}

interface Contact {
  _id: string
  firstName: string
  lastName: string
  email: string
  company: string
  phone: string
  listNames: string[]
  createdAt: string
}

interface Campaign {
  _id: string
  templateId: string
  templateName: string
  listNames: string[]
  customSubject: string
  customContent: string
  total_sent: number
  success_count: number
  error_count: number
  cc_recipients: number
  bcc_recipients: number
  created_at: string
  status: string
}

export default function SendEmails() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedList, setSelectedList] = useState<string>('all')
  const [customSubject, setCustomSubject] = useState('')
  const [customContent, setCustomContent] = useState('')
  const [testMode, setTestMode] = useState(false)
  const [ccEmails, setCcEmails] = useState<string[]>([])
  const [bccEmails, setBccEmails] = useState<string[]>([])
  const [ccList, setCcList] = useState<string>('')
  const [bccList, setBccList] = useState<string>('')
  const [ccIndividual, setCcIndividual] = useState('')
  const [bccIndividual, setBccIndividual] = useState('')
  const [showCcBcc, setShowCcBcc] = useState(false)

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

      if (templatesData.success) {
        setTemplates(templatesData.data)
      }
      if (contactsData.success) {
        setContacts(contactsData.data)
      }
      if (campaignsData.success) {
        setCampaigns(campaignsData.data)
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
    // Validate that we have either a template OR custom content
    if (!selectedTemplate && (!customSubject || !customContent)) {
      toast.error('Enter both subject and content when not using a template')
      return
    }

    if (testMode && contacts.filter(c => (c.listNames && Array.isArray(c.listNames) && c.listNames.includes(selectedList)) || selectedList === 'all').length > 5) {
      toast.error('Test mode only allows maximum 5 emails')
      return
    }

    if (!confirm(`Are you sure you want to send ${testMode ? '5' : 'all'} emails?`)) {
      return
    }

    try {
      setSending(true)
      const requestBody = {
        templateId: selectedTemplate || undefined,
        listName: selectedList,
        customSubject: customSubject || undefined,
        customContent: customContent || undefined,
        testMode,
        ccEmails: getAllCcEmails().length > 0 ? getAllCcEmails() : undefined,
        bccEmails: getAllBccEmails().length > 0 ? getAllBccEmails() : undefined
      }

      const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

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
    setCcEmails([])
    setBccEmails([])
    setCcList('')
    setBccList('')
    setCcIndividual('')
    setBccIndividual('')
    setShowCcBcc(false)
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
    return templates.find(t => t._id === selectedTemplate)
  }

  const getSelectedContacts = () => {
    if (selectedList === 'all') {
      return contacts
    }
    
    return contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(selectedList))
  }

  // Get stats
  const getStats = () => {
    const totalContacts = contacts.length
    const totalTemplates = templates.length
    const totalCampaigns = campaigns.length
    const totalSent = campaigns.reduce((sum, c) => sum + (c.total_sent || 0), 0)
    const totalSuccess = campaigns.reduce((sum, c) => sum + (c.success_count || 0), 0)
    const totalErrors = campaigns.reduce((sum, c) => sum + (c.error_count || 0), 0)

    return { totalContacts, totalTemplates, totalCampaigns, totalSent, totalSuccess, totalErrors }
  }

  // Handle CC/BCC email input
  const handleCcBccInput = (type: 'cc' | 'bcc', value: string) => {
    const emails = value.split(',').map(email => email.trim()).filter(email => email && email.includes('@'))
    
    if (type === 'cc') {
      setCcIndividual(value)
      setCcEmails(emails)
    } else {
      setBccIndividual(value)
      setBccEmails(emails)
    }
  }

  // Handle CC/BCC list selection
  const handleCcBccListChange = (type: 'cc' | 'bcc', listName: string) => {
    if (type === 'cc') {
      setCcList(listName)
    } else {
      setBccList(listName)
    }
  }

  // Get all CC emails (list + individual)
  const getAllCcEmails = () => {
    let allEmails: string[] = []
    
    // Add emails from selected list
    if (ccList && ccList !== '') {
      const listContacts = contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(ccList))
      allEmails.push(...listContacts.map(c => c.email))
    }
    
    // Add individual emails
    allEmails.push(...ccEmails)
    
    return allEmails
  }

  // Get all BCC emails (list + individual)
  const getAllBccEmails = () => {
    let allEmails: string[] = []
    
    // Add emails from selected list
    if (bccList && bccList !== '') {
      const listContacts = contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(bccList))
      allEmails.push(...listContacts.map(c => c.email))
    }
    
    // Add individual emails
    allEmails.push(...bccEmails)
    
    return allEmails
  }

  // Get campaign status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800', text: 'Draft', icon: DocumentTextIcon },
      sending: { color: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800', text: 'Sending', icon: PlayIcon },
      sent: { color: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800', text: 'Sent', icon: CheckCircleIcon },
      failed: { color: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800', text: 'Failed', icon: PauseIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.color} shadow-sm`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading campaign data...</p>
        </div>
      </div>
    )
  }

  const stats = getStats()
  const selectedContacts = getSelectedContacts()

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <SparklesIcon className="w-10 h-10 mr-3 text-yellow-300" />
                Email Campaigns
              </h1>
              <p className="text-xl text-blue-100">Create and manage powerful email campaigns</p>
            </div>
            <button
              onClick={openModal}
              className="group relative px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-50"
            >
              <PaperAirplaneIcon className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              New Campaign
            </button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalContacts.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <UsersIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Templates</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTemplates}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <DocumentTextIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
              <ChartBarIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Emails Sent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSuccess.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
              <EyeIcon className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent campaigns with enhanced design */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ClockIcon className="w-6 h-6 mr-3 text-gray-600" />
            Recent Campaigns
          </h2>
          <p className="text-gray-600 mt-1">Monitor your latest email campaign performance</p>
        </div>
        
        {campaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    List
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {campaigns.slice(0, 5).map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{campaign.templateName}</div>
                        <div className="text-sm text-gray-500">{campaign.customSubject}</div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm">
                        {campaign.listNames && Array.isArray(campaign.listNames) && campaign.listNames.length > 0 ? campaign.listNames.join(', ') : 'All'}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      {getStatusBadge(campaign.status || 'draft')}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-semibold">{campaign.success_count || 0}</span>
                        </div>
                        <span className="text-gray-400">/</span>
                        <span className="font-semibold">{campaign.total_sent || 0}</span>
                        {(campaign.error_count || 0) > 0 && (
                          <>
                            <span className="text-gray-400">/</span>
                            <span className="text-red-600 font-semibold">{campaign.error_count || 0}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                      {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-6">Create your first email campaign to get started</p>
            <button
              onClick={openModal}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5 mr-2" />
              Create Campaign
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Modal for new campaign */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-4 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">New Email Campaign</h2>
                  <p className="text-blue-100 text-lg">Create a powerful email campaign to engage your audience</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Test mode with enhanced design */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="testMode"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="testMode" className="text-lg font-semibold text-amber-800">
                    🧪 Test Mode
                  </label>
                </div>
                <p className="text-amber-700 mt-2 ml-8">
                  Send to maximum 5 contacts for testing purposes
                </p>
              </div>

              {/* Template selection with enhanced design */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  📋 Select Template
                </label>
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value && value !== '') {
                      setSelectedTemplate(value)
                    } else {
                      setSelectedTemplate(null)
                    }
                  }}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-200"
                >
                  <option value="">🎨 No template (custom content)</option>
                  {templates.map(template => (
                    <option key={template._id} value={template._id}>
                      📄 {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* List selection with enhanced design */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  👥 Contact List
                </label>
                <select
                  value={selectedList}
                  onChange={(e) => {
                    setSelectedList(e.target.value)
                  }}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-200"
                >
                  <option value="all">🌍 All lists ({contacts.length} contacts)</option>
                  {Array.from(new Set(contacts.flatMap(c => c.listNames || []).filter(Boolean))).map(list => {
                    const count = contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(list)).length
                    return (
                      <option key={list} value={list}>
                        📋 {list} ({count} contacts)
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* CC and BCC Section with enhanced design */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">📧 Additional Recipients</h3>
                  <button
                    type="button"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    {showCcBcc ? '🙈 Hide' : '👁️ Show'} CC/BCC
                  </button>
                </div>

                {showCcBcc && (
                  <div className="space-y-8 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                    {/* CC Field */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        📬 CC (Carbon Copy)
                      </label>
                      
                      {/* List Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          📋 Select complete list:
                        </label>
                        <select
                          value={ccList}
                          onChange={(e) => handleCcBccListChange('cc', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">-- No list --</option>
                          {Array.from(new Set(contacts.flatMap(c => c.listNames || []).filter(Boolean))).map(list => {
                            const count = contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(list)).length
                            return (
                              <option key={list} value={list}>
                                {list} ({count} contacts)
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* Individual Emails */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          📧 Additional emails:
                        </label>
                        <input
                          type="text"
                          value={ccIndividual}
                          placeholder="email1@example.com, email2@example.com"
                          onChange={(e) => handleCcBccInput('cc', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Additional emails separated by commas. These recipients will be visible to everyone.
                        </p>
                      </div>

                      {/* Total CC Emails Display */}
                      {getAllCcEmails().length > 0 && (
                        <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-xl">
                          <div className="text-sm font-semibold text-blue-800 mb-2">
                            📊 Total CC: {getAllCcEmails().length} emails
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getAllCcEmails().map((email, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-200 text-blue-800 font-medium">
                                {email}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* BCC Field */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        🙈 BCC (Blind Carbon Copy)
                      </label>
                      
                      {/* List Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          📋 Select complete list:
                        </label>
                        <select
                          value={bccList}
                          onChange={(e) => handleCcBccListChange('bcc', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">-- No list --</option>
                          {Array.from(new Set(contacts.flatMap(c => c.listNames || []).filter(Boolean))).map(list => {
                            const count = contacts.filter(c => c.listNames && Array.isArray(c.listNames) && c.listNames.includes(list)).length
                            return (
                              <option key={list} value={list}>
                                {list} ({count} contacts)
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* Individual Emails */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          📧 Additional emails:
                        </label>
                        <input
                          type="text"
                          value={bccIndividual}
                          placeholder="email1@example.com, email2@example.com"
                          onChange={(e) => handleCcBccInput('bcc', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Additional emails separated by commas. These recipients will be hidden from others.
                        </p>
                      </div>

                      {/* Total BCC Emails Display */}
                      {getAllBccEmails().length > 0 && (
                        <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-xl">
                          <div className="text-sm font-semibold text-green-800 mb-2">
                            📊 Total BCC: {getAllBccEmails().length} emails
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getAllBccEmails().map((email, index) => (
                              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-200 text-green-800 font-medium">
                                {email}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Template preview with enhanced design */}
              {selectedTemplate && getSelectedTemplate() && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    Template Preview
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-purple-600 font-medium">Subject:</span>
                      <p className="text-lg font-semibold text-purple-900">{getSelectedTemplate()?.subject}</p>
                    </div>
                    <div>
                      <span className="text-sm text-purple-600 font-medium">Content:</span>
                      <div className="text-sm text-purple-800 line-clamp-3 bg-white p-3 rounded-lg border border-purple-200">
                        {getSelectedTemplate()?.content.replace(/<[^>]*>/g, '')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom content with enhanced design */}
              {!selectedTemplate && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      📧 Email Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg transition-all duration-200"
                      placeholder="Your compelling email subject..."
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      ✨ Email Content *
                    </label>
                    <RichTextEditor
                      value={customContent}
                      onChange={setCustomContent}
                      placeholder="<h1>Hello!</h1><p>Your email content...</p>"
                      height="h-80"
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-3">
                      💡 You can use HTML and variables like {'{firstName}'}, {'{lastName}'}, {'{company}'}
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  Campaign Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>📧 Contacts to send:</span>
                      <span className="font-semibold">{selectedContacts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎯 Mode:</span>
                      <span className="font-semibold">{testMode ? 'Test (max. 5)' : 'Production'}</span>
                    </div>
                    {selectedTemplate && (
                      <div className="flex justify-between">
                        <span>📋 Template:</span>
                        <span className="font-semibold">{getSelectedTemplate()?.name}</span>
                      </div>
                    )}
                    {!selectedTemplate && (
                      <div className="flex justify-between">
                        <span>📝 Type:</span>
                        <span className="font-semibold">Custom content</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {getAllCcEmails().length > 0 && (
                      <div className="flex justify-between">
                        <span>📬 CC recipients:</span>
                        <span className="font-semibold">{getAllCcEmails().length}</span>
                      </div>
                    )}
                    {getAllBccEmails().length > 0 && (
                      <div className="flex justify-between">
                        <span>🙈 BCC recipients:</span>
                        <span className="font-semibold">{getAllBccEmails().length}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>🚀 Max emails allowed:</span>
                      <span className="font-semibold text-green-600">350</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSendEmails}
                  disabled={sending || (!selectedTemplate && (!customSubject || !customContent))}
                  className="flex-1 group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      {testMode ? 'Send Test' : 'Send Campaign'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
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
