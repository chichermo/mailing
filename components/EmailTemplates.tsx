'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  DocumentTextIcon,
  SparklesIcon,
  EyeIcon,
  CodeBracketIcon,
  VariableIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import WorkingEditor from './WorkingEditor'

interface EmailTemplate {
  _id: string
  name: string
  subject: string
  content: string
  variables: string
  createdAt: string
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    variables: ''
  })

  // Load templates
  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      const data = await response.json()
      
      if (data.success) {
        setTemplates(data.data)
      } else {
        console.error('❌ Error loading templates:', data.error)
        toast.error('Error loading templates')
      }
    } catch (error) {
      console.error('❌ Error loading templates:', error)
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  // Open modal for new template
  const openModal = () => {
    setShowModal(true)
    setEditingTemplate(null)
    setFormData({
      name: '',
      subject: '',
      content: '',
      variables: ''
    })
  }

  // Open modal for editing template
  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name || '',
      subject: template.subject || '',
      content: template.content || '',
      variables: template.variables || ''
    })
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setEditingTemplate(null)
    setFormData({
      name: '',
      subject: '',
      content: '',
      variables: ''
    })
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Template name is required')
      return
    }
    if (!formData.subject.trim()) {
      toast.error('Email subject is required')
      return
    }
    if (!formData.content.trim()) {
      toast.error('Email content is required')
      return
    }

    try {
      const url = editingTemplate ? `/api/templates/${editingTemplate._id}` : '/api/templates'
      const method = editingTemplate ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(editingTemplate ? 'Template updated successfully!' : 'Template created successfully!')
        closeModal()
        loadTemplates()
      } else {
        toast.error(result.error || 'Error saving template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Connection error')
    }
  }

  // Delete template
  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('Template deleted successfully!')
        loadTemplates()
      } else {
        toast.error(result.error || 'Error deleting template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Connection error')
    }
  }

  // Insert variable into editor
  const insertVariable = (variable: string) => {
    const newContent = formData.content + variable
    setFormData(prev => ({ ...prev, content: newContent }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <SparklesIcon className="w-10 h-10 mr-3 text-yellow-200" />
                Email Templates
              </h1>
              <p className="text-xl text-blue-100">Create and manage corporate email templates</p>
            </div>
            <button
              onClick={openModal}
              className="btn-secondary btn-lg group relative shadow-xl hover:shadow-2xl"
            >
              <PlusIcon className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Template
            </button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Templates Grid */}
      {templates && Array.isArray(templates) && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template._id} className="card card-hover group overflow-hidden">
              {/* Template Header */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="p-2 bg-white/80 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit template"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="p-2 bg-white/80 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete template"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600">
                  Created: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {/* Template Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Subject</label>
                    <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {template.subject}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Content Preview</label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-32 overflow-hidden">
                      <div 
                        className="text-sm text-gray-700 line-clamp-4"
                        dangerouslySetInnerHTML={{ 
                          __html: template.content ? template.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 'No content' 
                        }} 
                      />
                    </div>
                  </div>

                  {template.variables && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Variables</label>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            if (Array.isArray(template.variables)) {
                              return template.variables.map((variable, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                                  <VariableIcon className="w-3 h-3 mr-1" />
                                  {String(variable)}
                                </span>
                              ));
                            } else if (typeof template.variables === 'string' && template.variables.trim()) {
                              return template.variables.split(',').map((variable, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                                  <VariableIcon className="w-3 h-3 mr-1" />
                                  {variable.trim()}
                                </span>
                              ));
                            } else if (template.variables && typeof template.variables === 'object') {
                              // Si es un objeto, mostrar las claves
                              return Object.keys(template.variables).map((key, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 font-medium">
                                  <VariableIcon className="w-3 h-3 mr-1" />
                                  {key}
                                </span>
                              ));
                            }
                            return null;
                          } catch (error) {
                            console.warn('Error processing template variables:', error, template.variables);
                            return (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                                <VariableIcon className="w-3 h-3 mr-1" />
                                Variables (error)
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <DocumentTextIcon className="w-12 h-12 text-blue-700" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No templates yet</h3>
          <p className="text-gray-600 mb-8 text-lg">Create your first template to launch a campaign</p>
          <button
            onClick={openModal}
            className="btn-primary btn-lg inline-flex items-center"
          >
            <PlusIcon className="w-6 h-6 mr-2" />
            Create Template
          </button>
        </div>
      )}

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 text-white p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {editingTemplate ? 'Edit Template' : 'New Template'}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {editingTemplate ? 'Update your email template' : 'Create a professional email template'}
                  </p>
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
              {/* Template Name */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input text-lg"
                  placeholder="Enter template name..."
                />
              </div>

              {/* Email Subject */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Email Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="input text-lg"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Variables Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <VariableIcon className="w-5 h-5 mr-2" />
                  Dynamic Variables
                </h3>
                <p className="text-blue-700 mb-4">
                  Click on a variable to insert it into your email content. These will be replaced with actual contact data when sending emails.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'First Name', variable: '{{firstName}}', color: 'bg-blue-100 text-blue-800' },
                    { label: 'Last Name', variable: '{{lastName}}', color: 'bg-green-100 text-green-800' },
                    { label: 'Email', variable: '{{email}}', color: 'bg-purple-100 text-purple-800' },
                    { label: 'Company', variable: '{{company}}', color: 'bg-orange-100 text-orange-800' },
                    { label: 'Phone', variable: '{{phone}}', color: 'bg-red-100 text-red-800' },
                    { label: 'List Name', variable: '{{listName}}', color: 'bg-indigo-100 text-indigo-800' }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => insertVariable(item.variable)}
                      className={`p-3 rounded-xl font-medium text-sm hover:scale-105 transition-all duration-200 ${item.color} hover:shadow-md`}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-xs opacity-75 font-mono">{item.variable}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Content */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Email Content *
                </label>
                <WorkingEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="<h1>Welcome!</h1><p>Your email content here...</p>"
                  height="h-96"
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Use the toolbar above to format your content. You can use HTML and insert variables from above.
                </p>
              </div>

              {/* Custom Variables */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-900">
                  Custom Variables (Optional)
                </label>
                <input
                  type="text"
                  value={formData.variables}
                  onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
                  className="input text-lg"
                  placeholder="variable1, variable2, variable3 (comma separated)"
                />
                <p className="text-sm text-gray-500">
                  Add custom variables separated by commas. These will be available as {'{variable1}'}, {'{variable2}'}, etc.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1 text-lg"
                >
                  {editingTemplate ? (
                    <>
                      <PencilIcon className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      Update Template
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                      Create Template
                    </>
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="btn-secondary flex-1 text-lg"
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
