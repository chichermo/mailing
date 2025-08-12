'use client'

import { useState } from 'react'
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function EmailTest() {
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const testEmailSending = async () => {
    setTesting(true)
    setTestResults(null)
    
    try {
      // First, let's add a test contact
      console.log('Adding test contact...')
      const contactResponse = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          company: 'Test Company',
          phone: '+1234567890',
          listName: 'Test'
        })
      })

      if (!contactResponse.ok) {
        throw new Error('Failed to create test contact')
      }

      // Create a test template
      console.log('Creating test template...')
      const templateResponse = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Template',
          subject: 'Test Email - {{firstName}}',
          content: '<h1>Hello {{firstName}}!</h1><p>This is a test email from your system.</p><p>Company: {{company}}</p>'
        })
      })

      if (!templateResponse.ok) {
        throw new Error('Failed to create test template')
      }

      const templateData = await templateResponse.json()
      const templateId = templateData.data.id

      // Send test email
      console.log('Sending test email...')
      const sendResponse = await fetch('/api/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: templateId,
          listName: 'Test',
          testMode: true
        })
      })

      const sendResult = await sendResponse.json()
      console.log('Send result:', sendResult)

      if (sendResult.success) {
        setTestResults({
          success: true,
          message: 'Test email sent successfully!',
          details: sendResult.data
        })
        toast.success('Test email sent successfully!')
      } else {
        setTestResults({
          success: false,
          message: 'Failed to send test email',
          details: sendResult.error
        })
        toast.error('Failed to send test email')
      }

    } catch (error) {
      console.error('Error in email test:', error)
      setTestResults({
        success: false,
        message: 'Error during email test',
        details: error instanceof Error ? error.message : String(error)
      })
      toast.error('Error during email test')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <EnvelopeIcon className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-medium text-gray-900">Email System Test</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        This test will create a test contact, template, and send a test email to verify your email system is working correctly.
      </p>

      <button
        onClick={testEmailSending}
        disabled={testing}
        className="btn-primary mb-4"
      >
        {testing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Testing Email System...
          </>
        ) : (
          <>
            <PaperAirplaneIcon className="w-4 h-4 mr-2" />
            Test Email System
          </>
        )}
      </button>

      {testResults && (
        <div className={`p-4 rounded-lg border ${
          testResults.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {testResults.success ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              testResults.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {testResults.message}
            </span>
          </div>
          
          {testResults.details && (
            <div className="text-sm text-gray-700">
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(testResults.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">What this test does:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Creates a test contact in your database</li>
          <li>• Creates a test email template with dynamic variables</li>
          <li>• Sends a test email using the template</li>
          <li>• Verifies the entire email workflow is functioning</li>
        </ul>
      </div>
    </div>
  )
}
