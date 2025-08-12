'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function TestAPI() {
  const [testing, setTesting] = useState(false)

  const testAPIs = async () => {
    setTesting(true)
    
    try {
      // Test contacts API
      console.log('Testing contacts API...')
      const contactsResponse = await fetch('/api/contacts')
      console.log('Contacts API response:', contactsResponse.status)
      
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json()
        console.log('Contacts data:', contactsData)
        toast.success('Contacts API working')
      } else {
        toast.error(`Error in contacts API: ${contactsResponse.status}`)
      }

      // Test templates API
      console.log('Testing templates API...')
      const templatesResponse = await fetch('/api/templates')
      console.log('Templates API response:', templatesResponse.status)
      
      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json()
        console.log('Templates data:', templatesData)
        toast.success('Templates API working')
      } else {
        toast.error(`Error in templates API: ${templatesResponse.status}`)
      }

    } catch (error) {
      console.error('Error testing APIs:', error)
      toast.error('Connection error with APIs')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-lg font-medium text-yellow-900 mb-2">API Test</h3>
      <p className="text-sm text-yellow-800 mb-3">
        Use this button to verify that the APIs are working correctly
      </p>
      <button
        onClick={testAPIs}
        disabled={testing}
        className="btn-secondary"
      >
        {testing ? 'Testing...' : 'Test APIs'}
      </button>
    </div>
  )
}
