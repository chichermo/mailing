'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
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
import toast from 'react-hot-toast'

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
})

// Import Quill styles
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string
  showToolbar?: boolean
}

// Custom icons for missing Heroicons
const UndoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
)

const RedoIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
  </svg>
)

const QuoteIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const LinkBreakIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

const AlignLeftIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
  </svg>
)

const AlignCenterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M6 12h12M8 18h8" />
  </svg>
)

const AlignRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M14 18h6" />
  </svg>
)

const AlignJustifyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const ListNumberedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
)

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = '',
  height = 'h-64',
  showToolbar = true
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [currentColor, setCurrentColor] = useState('#000000')
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff')
  const quillRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Quill modules configuration
  const modules = {
    toolbar: false, // Disable default toolbar to use custom one
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  }

  // Allowed formats
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ]

  // Editor functions
  const formatText = (format: string, value?: any) => {
    if (quillRef.current) {
      quillRef.current.format(format, value)
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      if (quillRef.current) {
        const range = quillRef.current.getSelection()
        if (range) {
          // Insert link in selected text
          quillRef.current.insertText(range.index, linkText)
          quillRef.current.formatText(range.index, linkText.length, 'link', linkUrl)
        } else {
          // If no selection, insert at the end
          const length = quillRef.current.getLength()
          quillRef.current.insertText(length, linkText)
          quillRef.current.formatText(length, linkText.length, 'link', linkUrl)
        }
      }
      setShowLinkDialog(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  const insertImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (quillRef.current) {
            const range = quillRef.current.getSelection()
            const index = range ? range.index : quillRef.current.getLength()
            quillRef.current.insertEmbed(index, 'image', e.target?.result)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const insertImageFromUrl = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      if (quillRef.current) {
        const range = quillRef.current.getSelection()
        const index = range ? range.index : quillRef.current.getLength()
        quillRef.current.insertEmbed(index, 'image', url)
      }
    }
  }

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')
    if (rows && cols) {
      if (quillRef.current) {
        const range = quillRef.current.getSelection()
        const index = range ? range.index : quillRef.current.getLength()
        
        // Create basic HTML table
        let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">'
        for (let i = 0; i < parseInt(rows); i++) {
          tableHTML += '<tr>'
          for (let j = 0; j < parseInt(cols); j++) {
            tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>'
          }
          tableHTML += '</tr>'
        }
        tableHTML += '</table>'
        
        // Insert table
        quillRef.current.clipboard.dangerouslyPasteHTML(index, tableHTML)
      }
    }
  }

  const changeTextColor = (color: string) => {
    setCurrentColor(color)
    formatText('color', color)
    setShowColorPicker(false)
  }

  const changeBackgroundColor = (color: string) => {
    setCurrentBgColor(color)
    formatText('background', color)
    setShowColorPicker(false)
  }

  const removeLink = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection()
      if (range) {
        quillRef.current.formatText(range.index, range.length, 'link', false)
      }
    }
  }

  const editLink = () => {
    if (quillRef.current) {
      const range = quillRef.current.getSelection()
      
      // If there's selected text, check if it's already a link
      if (range && range.length > 0) {
        const formats = quillRef.current.getFormat(range.index, range.length)
        if (formats.link) {
          // Edit existing link
          setLinkUrl(formats.link)
          setLinkText(quillRef.current.getText(range.index, range.length))
          setShowLinkDialog(true)
        } else {
          // Convert selected text to link
          setLinkUrl('')
          setLinkText(quillRef.current.getText(range.index, range.length))
          setShowLinkDialog(true)
        }
      } else {
        // If no selection, show informative message
        toast('Select text to create or edit a link', {
          icon: '💡',
          duration: 3000
        })
        return
      }
    }
  }

  if (!mounted) {
    return (
      <div className={`${height} bg-gray-100 animate-pulse rounded-lg ${className}`}></div>
    )
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Top menu bar */}
      {showToolbar && (
        <div className="bg-gray-800 text-white border-b border-gray-700">
          <div className="flex items-center px-4 py-2 space-x-6 text-sm">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'edit' ? 'bg-gray-700' : ''}`}
            >
              Edit
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'format' ? null : 'format')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'format' ? 'bg-gray-700' : ''}`}
            >
              Format
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'media' ? null : 'media')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'media' ? 'bg-gray-700' : ''}`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'table' ? null : 'table')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'table' ? 'bg-gray-700' : ''}`}
            >
              Table
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'insert' ? null : 'insert')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'insert' ? 'bg-gray-700' : ''}`}
            >
              Insert
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'view' ? 'bg-gray-700' : ''}`}
            >
              View
            </button>
          </div>

          {/* Dropdown menus */}
          {activeMenu === 'edit' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={() => quillRef.current?.history.undo()} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <UndoIcon className="w-4 h-4 inline mr-2" />
                  Undo
                </button>
                <button onClick={() => quillRef.current?.history.redo()} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <RedoIcon className="w-4 h-4 inline mr-2" />
                  Redo
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'format' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <select 
                  onChange={(e) => formatText('font', e.target.value)}
                  className="bg-gray-600 text-white px-2 py-1 rounded border border-gray-500"
                >
                  <option value="Open Sans">Open Sans</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
                <select 
                  onChange={(e) => formatText('size', e.target.value)}
                  className="bg-gray-600 text-white px-2 py-1 rounded border border-gray-500"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                </select>
              </div>
            </div>
          )}

          {activeMenu === 'media' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={insertImage} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <PhotoIcon className="w-4 h-4 inline mr-2" />
                  Image from file
                </button>
                <button onClick={insertImageFromUrl} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <PhotoIcon className="w-4 h-4 inline mr-2" />
                  Image from URL
                </button>
                <button className="hover:bg-gray-600 px-2 py-1 rounded">
                  <VideoCameraIcon className="w-4 h-4 inline mr-2" />
                  Video
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'table' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={insertTable} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <TableCellsIcon className="w-4 h-4 inline mr-2" />
                  Insert table
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'insert' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={() => formatText('blockquote')} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <QuoteIcon className="w-4 h-4 inline mr-2" />
                  Quote
                </button>
                <button onClick={() => formatText('code-block')} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                  Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main toolbar */}
      {showToolbar && (
        <div className="bg-gray-100 border-b border-gray-300 p-3">
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

            {/* Colors */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center"
                title="Text color"
              >
                <span className="text-red-500 font-bold text-sm">A</span>
                <MinusIcon className="w-3 h-3 ml-1" />
              </button>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Background color"
              >
                <div className="w-4 h-4 border border-gray-400 rounded-sm bg-yellow-200"></div>
                <MinusIcon className="w-3 h-3" />
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
              <button
                onClick={editLink}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Edit link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={removeLink}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-400"
                title="Remove link"
              >
                <LinkBreakIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Emoji */}
            <button className="p-2 hover:bg-gray-200 rounded transition-colors text-xl">
              😊
            </button>
          </div>

          {/* Second toolbar row */}
          <div className="flex items-center space-x-4 mt-3">
            {/* Alignment */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('align', 'left')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Align left"
              >
                <AlignLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'center')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Center"
              >
                <AlignCenterIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'right')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Align right"
              >
                <AlignRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'justify')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Justify"
              >
                <AlignJustifyIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('list', 'bullet')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bullet list"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('list', 'ordered')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Numbered list"
              >
                <ListNumberedIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => formatText('indent', '+1')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Increase indent"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => formatText('indent', '-1')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Decrease indent"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color picker */}
          {showColorPicker && (
            <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="mb-3">
                <div className="flex space-x-4 mb-2">
                  <button
                    onClick={() => changeTextColor(currentColor)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Text color
                  </button>
                  <button
                    onClick={() => changeBackgroundColor(currentBgColor)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Background color
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Current color:</span>
                  <div 
                    className="w-6 h-6 border border-gray-300 rounded"
                    style={{ backgroundColor: currentColor }}
                  ></div>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
                  '#f2f2f2', '#f7f7f7', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
                  '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd',
                  '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#dd7e6b',
                  '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a6d6', '#d5a6bd'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main editor */}
      <div className={`${height} border border-gray-300 rounded-b-lg ${!showToolbar ? 'rounded-t-lg' : ''}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="h-full"
          style={{ height: '100%' }}
        />
      </div>

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

      {/* Help information */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="ml-4 space-y-1">
          <li>• Use the top menu bar to access advanced options</li>
          <li>• The toolbar allows you to format text quickly</li>
          <li>• You can insert images, links and tables from the menus</li>
          <li>• Variables like {'{{firstName}}'} will be automatically replaced</li>
          <li>• Select text before applying formatting or inserting links</li>
        </ul>
      </div>
    </div>
  )
}
