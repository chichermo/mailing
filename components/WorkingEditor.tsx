'use client'

import { useState, useRef } from 'react'

interface WorkingEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function WorkingEditor({ value, onChange, placeholder }: WorkingEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  // Insert link function - SIMPLE AND WORKING
  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" target="_blank">${linkText}</a>`
      
      if (editorRef.current) {
        // Insert at the end of content
        const currentContent = editorRef.current.innerHTML
        const newContent = currentContent + ' ' + linkHTML
        editorRef.current.innerHTML = newContent
        
        // Update parent component
        onChange(newContent)
      }
      
      setShowLinkDialog(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  // Insert image function - SIMPLE AND WORKING
  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const imgHTML = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`
      
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML
        const newContent = currentContent + ' ' + imgHTML
        editorRef.current.innerHTML = newContent
        onChange(newContent)
      }
    }
  }

  // Insert table function - SIMPLE AND WORKING
  const insertTable = () => {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">'
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>'
        }
        tableHTML += '</tr>'
      }
      tableHTML += '</table>'
      
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML
        const newContent = currentContent + ' ' + tableHTML
        editorRef.current.innerHTML = newContent
        onChange(newContent)
      }
    }
  }

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="working-editor">
      {/* Simple Toolbar */}
      <div className="bg-gray-100 border border-gray-300 p-3 rounded-t-lg">
        <div className="flex items-center space-x-4">
          {/* Basic formatting */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (editorRef.current) {
                  document.execCommand('bold', false)
                  handleContentChange()
                }
              }}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => {
                if (editorRef.current) {
                  document.execCommand('italic', false)
                  handleContentChange()
                }
              }}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => {
                if (editorRef.current) {
                  document.execCommand('underline', false)
                  handleContentChange()
                }
              }}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              <u>U</u>
            </button>
          </div>

          {/* Links and Media */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLinkDialog(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              + Link
            </button>
            <button
              onClick={insertImage}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              + Image
            </button>
            <button
              onClick={insertTable}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              + Table
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (editorRef.current) {
                  document.execCommand('insertUnorderedList', false)
                  handleContentChange()
                }
              }}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              • List
            </button>
            <button
              onClick={() => {
                if (editorRef.current) {
                  document.execCommand('insertOrderedList', false)
                  handleContentChange()
                }
              }}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              1. List
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div 
        ref={editorRef}
        contentEditable={true}
        className="min-h-80 border border-gray-300 rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onInput={handleContentChange}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link text:</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Text to display"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL:</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={insertLink}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Insert
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
