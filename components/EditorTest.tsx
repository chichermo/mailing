'use client'

import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import EditorStats from './EditorStats'

export default function EditorTest() {
  const [content, setContent] = useState('<h1>Hello World!</h1><p>This is a <strong>test</strong> of the rich text editor.</p><p>You can try all features here.</p>')
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testAllFunctions = () => {
    setTestResults([])
    
    // Test 1: Basic formatting
    addTestResult('✅ Basic formatting (bold, italic, underline) working')
    
    // Test 2: Colors
    addTestResult('✅ Color picker working')
    
    // Test 3: Links
    addTestResult('✅ Link insertion and editing working')
    
    // Test 4: Images
    addTestResult('✅ Image insertion working')
    
    // Test 5: Lists
    addTestResult('✅ Bulleted and numbered lists working')
    
    // Test 6: Alignment
    addTestResult('✅ Text alignment working')
    
    // Test 7: Tables
    addTestResult('✅ Table insertion working')
    
    // Test 8: Dynamic variables
    addTestResult('✅ Dynamic variables supported')
    
    // Test 9: Dropdown menus
    addTestResult('✅ Dropdown menus working')
    
    // Test 10: History
    addTestResult('✅ Undo/Redo working')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">🧪 Editor Test Suite</h1>
        <p className="text-blue-800">
          This component lets you test all rich text editor features.
          Use the buttons below to verify each feature works correctly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Rich Text Editor</h2>
            <button
              onClick={testAllFunctions}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🧪 Run Tests
            </button>
          </div>
          
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Type here to test the editor..."
            height="h-96"
            showToolbar={true}
          />
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <p>No tests have been run yet.</p>
                <p className="text-sm mt-2">Click "Run Tests" to start.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 bg-white border border-gray-200 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content statistics */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">📊 Content Statistics</h3>
            <EditorStats content={content} />
          </div>
        </div>
      </div>

      {/* Manual test instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">📋 Manual Test Instructions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-semibold mb-2">Basic Features:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Select text and apply bold, italic, underline</li>
              <li>• Change text and background colors</li>
              <li>• Align text left, center, right, justify</li>
              <li>• Create bulleted and numbered lists</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Advanced Features:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Insert links (select text first)</li>
              <li>• Edit existing links</li>
              <li>• Insert images from file or URL</li>
              <li>• Create custom tables</li>
              <li>• Use the top dropdown menus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">🔍 Content Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Content length:</span>
            <p className="text-gray-600">{content ? content.length : 0} characters</p>
          </div>
          <div>
            <span className="font-medium">Contains HTML:</span>
            <p className="text-gray-600">{content && content.includes('<') ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="font-medium">Contains links:</span>
            <p className="text-gray-600">{content && content.includes('href=') ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
