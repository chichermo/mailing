'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  ListBulletIcon, 
  LinkIcon,
  PhotoIcon,
  PlusIcon,
  MinusIcon,
  TableCellsIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

interface SimpleRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string
}

export default function SimpleRichEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
  height = 'h-64'
}: SimpleRichEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Format text functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
  }

  // Insert link function
  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
      
      if (editorRef.current) {
        // Insert at cursor position or at the end
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const linkNode = document.createElement('div')
          linkNode.innerHTML = linkHTML
          range.insertNode(linkNode.firstChild!)
        } else {
          // Insert at the end
          editorRef.current.insertAdjacentHTML('beforeend', linkHTML)
        }
        
        handleContentChange()
      }
      
      setShowLinkDialog(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  // Insert image function
  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      const imgHTML = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`
      
      if (editorRef.current) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const imgNode = document.createElement('div')
          imgNode.innerHTML = imgHTML
          range.insertNode(imgNode.firstChild!)
        } else {
          editorRef.current.insertAdjacentHTML('beforeend', imgHTML)
        }
        
        handleContentChange()
      }
    }
  }

  // Insert table function
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
        editorRef.current.insertAdjacentHTML('beforeend', tableHTML)
        handleContentChange()
      }
    }
  }

  return (
    <div className={`simple-rich-editor ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-100 border border-gray-300 p-3 rounded-t-lg">
        <div className="flex items-center space-x-4">
          {/* Text formatting */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <BoldIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <ItalicIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowLinkDialog(true)}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert link"
            >
              <PlusIcon className="w-4 h-4" />
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Media */}
          <div className="flex items-center space-x-1">
            <button
              onClick={insertImage}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert image"
            >
              <PhotoIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertTable}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert table"
            >
              <TableCellsIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet list"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered list"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => formatText('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align left"
            >
              <div className="w-4 h-4 border-t-2 border-gray-600"></div>
            </button>
            <button
              onClick={() => formatText('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Center"
            >
              <div className="w-4 h-4 border-t-2 border-gray-600 mx-auto"></div>
            </button>
            <button
              onClick={() => formatText('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align right"
            >
              <div className="w-4 h-4 border-t-2 border-gray-600 ml-auto"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div 
        ref={editorRef}
        contentEditable={true}
        className={`${height} border border-gray-300 rounded-b-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
      />

      {/* Link dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert link</h3>
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
