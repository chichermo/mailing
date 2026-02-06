'use client'

import { useState, useRef, useEffect } from 'react'

interface WorkingEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function WorkingEditor({ value, onChange, placeholder }: WorkingEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastEmittedHtmlRef = useRef<string>('')
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (!editorRef.current) return
    if (value === lastEmittedHtmlRef.current) return
    if (editorRef.current.innerHTML === value) return

    editorRef.current.innerHTML = value || ''
  }, [value])

  // Insert link function - FIXED TO RENDER PROPERLY
  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkHTML = `<a href="${linkUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${linkText}</a>`
      
      if (editorRef.current) {
        // Insert at the end of content
        const currentContent = editorRef.current.innerHTML
        const newContent = currentContent + ' ' + linkHTML
        editorRef.current.innerHTML = newContent
        lastEmittedHtmlRef.current = newContent
        // Update parent component
        onChange(newContent)
      }
      
      setShowLinkDialog(false)
      setLinkUrl('')
      setLinkText('')
    }
  }

  // Insert image function - FIXED WITH LOCAL UPLOAD
  const insertImage = () => {
    setShowImageDialog(true)
  }

  // Handle file upload - OPTIMIZED FOR SENDGRID
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo y tamaño de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image (JPEG, PNG, GIF, WebP)')
        return
      }
      
      if (file.size > maxSize) {
        alert('The image is too large. Maximum size is 5MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        
        // HTML optimizado para SendGrid y compatibilidad de email
        const imgHTML = `
          <img 
            src="${dataUrl}" 
            alt="Attached image" 
            style="max-width: 100%; height: auto; margin: 10px 0; display: block; border: 0; outline: none; text-decoration: none;" 
            width="auto"
            height="auto"
            border="0"
            align="middle"
          />
        `
        
        if (editorRef.current) {
          const currentContent = editorRef.current.innerHTML
          const newContent = currentContent + ' ' + imgHTML
          editorRef.current.innerHTML = newContent
          lastEmittedHtmlRef.current = newContent
          onChange(newContent)
        }
        
        setShowImageDialog(false)
        setImageUrl('')
      }
      reader.readAsDataURL(file)
    }
  }

  // Insert image from URL - OPTIMIZED FOR SENDGRID
  const insertImageFromUrl = () => {
    if (imageUrl) {
      // Validar que sea una URL válida
      try {
        new URL(imageUrl)
      } catch {
        alert('Please enter a valid URL')
        return
      }
      
      // HTML optimizado para SendGrid y compatibilidad de email
      const imgHTML = `
        <img 
          src="${imageUrl}" 
          alt="Image from URL" 
          style="max-width: 100%; height: auto; margin: 10px 0; display: block; border: 0; outline: none; text-decoration: none;" 
          width="auto"
          height="auto"
          border="0"
          align="middle"
        />
      `
      
      if (editorRef.current) {
        const currentContent = editorRef.current.innerHTML
        const newContent = currentContent + ' ' + imgHTML
        editorRef.current.innerHTML = newContent
        lastEmittedHtmlRef.current = newContent
        onChange(newContent)
      }
      
      setShowImageDialog(false)
      setImageUrl('')
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
        lastEmittedHtmlRef.current = newContent
        onChange(newContent)
      }
    }
  }

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      lastEmittedHtmlRef.current = html
      onChange(html)
    }
  }

  // Optimize existing images for SendGrid
  const optimizeImagesForSendGrid = () => {
    if (editorRef.current) {
      const images = editorRef.current.querySelectorAll('img')
      
      if (images.length === 0) {
        alert('No images found in the editor.\n\nTo use this feature:\n1. Upload an image with the "+ Image" button\n2. Or paste an image from the clipboard\n3. Then click "⚡ Optimize"')
        return
      }
      
      console.log(`🔧 Optimizing ${images.length} image(s) for SendGrid...`)
      
      images.forEach((img, index) => {
        // Agregar atributos optimizados para email
        img.setAttribute('border', '0')
        img.setAttribute('align', 'middle')
        img.style.display = 'block'
        img.style.outline = 'none'
        img.style.textDecoration = 'none'
        
        // Asegurar que tenga alt text
        if (!img.alt) {
          img.alt = 'Image'
        }
        
        console.log(`✅ Image ${index + 1} optimized:`, {
          src: img.src.substring(0, 50) + '...',
          alt: img.alt,
          border: img.getAttribute('border'),
          align: img.getAttribute('align')
        })
      })
      
      // Actualizar el contenido
      handleContentChange()
      
      // Mostrar confirmación
      alert(`Optimization completed.\n\nOptimized ${images.length} image(s) for SendGrid.\n\nApplied attributes:\n• border="0"\n• align="middle"\n• display: block\n• outline: none\n• text-decoration: none`)
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
              onClick={optimizeImagesForSendGrid}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Optimize images for SendGrid"
            >
              ⚡ Optimize
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
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
        onInput={handleContentChange}
        onFocus={() => {
          isFocusedRef.current = true
        }}
        onBlur={() => {
          isFocusedRef.current = false
          handleContentChange()
        }}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
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

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload from computer:</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG, GIF, WebP</p>
              </div>
              
              <div className="text-center text-gray-500">- OR -</div>
              
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL:</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={insertImageFromUrl}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Insert from URL
                </button>
                <button
                  onClick={() => setShowImageDialog(false)}
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
