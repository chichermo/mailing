'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  DocumentDuplicateIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import WorkingEditor from './WorkingEditor'
import HTMLViewer from './HTMLViewer'
import EditorStats from './EditorStats'

interface EmailTemplate {
  _id: string
  name: string
  subject: string
  content: string
  variables: string
}

interface TemplateFormData {
  name: string
  subject: string
  content: string
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    subject: '',
    content: ''
  })

  // Load templates
  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/templates')
      const result = await response.json()
      
      if (result.success) {
        setTemplates(result.data)
      } else {
        toast.error('Error loading templates')
      }
    } catch (error) {
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  // Debug form data changes
  useEffect(() => {
    console.log('Form data changed:', formData)
  }, [formData])

  // Form is always ready when editing
  const isFormReady = true

  // Create/Edit template
  const handleSubmit = async (e?: React.MouseEvent) => {
    console.log('🚨 TEMPLATE SAVE TRIGGERED!', { 
      event: e?.type || 'click', 
      editingTemplate: editingTemplate?._id,
      formData: { name: formData.name, subject: formData.subject, contentLength: formData.content ? formData.content.length : 0 },
      timestamp: new Date().toISOString()
    })
    
    // SIMPLE VALIDATION
    const trimmedName = formData.name.trim()
    const trimmedSubject = formData.subject.trim()
    const trimmedContent = formData.content.trim()
    
    if (!trimmedName) {
      toast.error('Template name is required')
      return
    }
    
    if (!trimmedSubject) {
      toast.error('Email subject is required')
      return
    }
    
    if (!trimmedContent) {
      toast.error('Email content is required')
      return
    }

    try {
      const url = '/api/templates'
      const method = editingTemplate ? 'PUT' : 'POST'
      const body = editingTemplate 
        ? { 
            name: trimmedName,
            subject: trimmedSubject, 
            content: trimmedContent,
            id: editingTemplate._id 
          }
        : {
            name: trimmedName,
            subject: trimmedSubject,
            content: trimmedContent
          }

      console.log('Sending template request:', { method, url, body })

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response result:', result)

      if (result.success) {
        toast.success(editingTemplate ? 'Template updated' : 'Template created')
        setShowModal(false)
        setEditingTemplate(null)
        resetForm()
        loadTemplates()
      } else {
        toast.error(result.error || 'Error saving template')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error('Connection error')
    }
  }

  // Delete template
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Template deleted')
        loadTemplates()
      } else {
        toast.error('Error deleting template')
      }
    } catch (error) {
      toast.error('Connection error')
    }
  }

  // Edit template
  const handleEdit = (template: EmailTemplate) => {
    console.log('Editing template:', template)
    
    // Ensure all fields have valid values
    const safeName = template.name || ''
    const safeSubject = template.subject || ''
    const safeContent = template.content || ''
    
    setEditingTemplate(template)
    setFormData({
      name: safeName,
      subject: safeSubject,
      content: safeContent
    })
    
    console.log('Form data set to:', { name: safeName, subject: safeSubject, content: safeContent })
    setShowModal(true)
  }

  // Preview template
  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  // Reset form
  const resetForm = () => {
    console.log('Resetting form')
    setFormData({
      name: '',
      subject: '',
      content: ''
    })
    setEditingTemplate(null)
  }

  // Open modal for new template
  const openNewTemplateModal = () => {
    setEditingTemplate(null)
    resetForm()
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    console.log('Closing modal')
    setShowModal(false)
    setEditingTemplate(null)
    resetForm()
  }

  // Insert variable into content
  const insertVariable = (variable: string) => {
    // Para el editor de texto enriquecido, simplemente agregamos la variable al final
    // o en la posición actual del cursor si es posible
    const newContent = formData.content + variable
    setFormData({ ...formData, content: newContent })
  }

  // Get available variables
  const availableVariables = [
    { key: '{{firstName}}', label: 'First Name', description: 'Contact first name' },
    { key: '{{lastName}}', label: 'Last Name', description: 'Contact last name' },
    { key: '{{email}}', label: 'Email', description: 'Contact email address' },
    { key: '{{company}}', label: 'Company', description: 'Contact company name' },
    { key: '{{phone}}', label: 'Phone', description: 'Contact phone number' },
    { key: '{{listName}}', label: 'List Name', description: 'Contact list name' }
  ]

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
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Create and manage email templates with dynamic content</p>
        </div>
        <button
          onClick={openNewTemplateModal}
          className="btn-primary"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template._id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(template)}
                  className="text-primary-600 hover:text-primary-900"
                  title="Preview"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="text-primary-600 hover:text-primary-900"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(template._id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Subject:</span>
                <p className="text-sm text-gray-900">{template.subject}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Content:</span>
                <div className="text-sm text-gray-700 line-clamp-3">
                  {template.content.replace(/<[^>]*>/g, '')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates && Array.isArray(templates) && templates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No templates created yet</div>
          <p className="text-sm text-gray-400 mt-2">Create your first template to get started</p>
        </div>
      )}

      {/* Modal for create/edit template */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                         <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold">
                 {editingTemplate ? 'Edit Template' : 'New Template'}
               </h2>
             </div>
            
                                                   <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Welcome Email, Newsletter, Promotional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Welcome to our newsletter!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content *
                </label>
                
                {/* Variable insertion toolbar */}
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <SparklesIcon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">Insert Dynamic Variables:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableVariables.map((variable) => (
                      <button
                        key={variable.key}
                        type="button"
                        onClick={() => insertVariable(variable.key)}
                        className="px-3 py-1 text-xs bg-primary-100 text-primary-800 rounded-md hover:bg-primary-200 transition-colors"
                        title={variable.description}
                      >
                        {variable.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click any variable above to insert it into your content. These will be automatically replaced with actual contact information when sending emails.
                  </p>
                </div>

                                                                   <div className="border border-gray-300 rounded-lg">
                    <WorkingEditor
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      placeholder="<h1>Hello {'{{firstName}}'}!</h1><p>Welcome to our newsletter. We're excited to have you on board.</p><p>Best regards,<br>The Team</p>"
                    />
                  </div>
                
                {/* Estadísticas del contenido */}
                <EditorStats content={formData.content} />
                
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-gray-500">
                    💡 <strong>Pro Tips:</strong>
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1 ml-4">
                    <li>• Use HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt; for formatting</li>
                    <li>• Insert variables like {'{{firstName}}'} for personalization</li>
                    <li>• Keep content engaging and mobile-friendly</li>
                    <li>• Test your template before sending to all contacts</li>
                  </ul>
                </div>
              </div>

                                                           <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 btn-primary"
                  >
                    {editingTemplate ? 'Update Template' : 'Create Template'}
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

      {/* Preview Modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Template Preview: {previewTemplate.name}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Subject:</span>
                <p className="text-lg font-semibold text-gray-900">{previewTemplate.subject}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Vista previa del contenido:</span>
                <div className="mt-2">
                  <HTMLViewer 
                    html={previewTemplate.content}
                    title="Vista previa del template"
                    showToggle={true}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Template Information:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• This template uses dynamic variables that will be replaced with actual contact information</p>
                  <p>• The content above shows how the template will look when sent</p>
                  <p>• You can edit this template anytime to make changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
