'use client'

import { useState } from 'react'
import { EyeIcon, CodeBracketIcon } from '@heroicons/react/24/outline'

interface HTMLViewerProps {
  html: string
  title?: string
  className?: string
  showToggle?: boolean
}

export default function HTMLViewer({ 
  html, 
  title = 'Vista previa', 
  className = '', 
  showToggle = true 
}: HTMLViewerProps) {
  const [showHTML, setShowHTML] = useState(false)

  if (!html || html.trim() === '') {
    return (
      <div className={`p-4 text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        No hay contenido para mostrar
      </div>
    )
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header con toggle */}
      {showToggle && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowHTML(false)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                !showHTML 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-1" />
              Vista previa
            </button>
            <button
              type="button"
              onClick={() => setShowHTML(true)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                showHTML 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <CodeBracketIcon className="w-4 h-4 inline mr-1" />
              HTML
            </button>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-4">
        {showHTML ? (
          // Vista del código HTML
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">
              {html}
            </pre>
          </div>
        ) : (
          // Vista previa renderizada
          <div className="prose max-w-none">
            <div 
              className="html-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
        <div className="text-xs text-blue-800">
          <span className="font-medium">💡 Consejo:</span> 
          {showHTML 
            ? ' Este es el código HTML que se enviará en el email. Puedes editarlo directamente si lo necesitas.'
            : ' Esta es la vista previa de cómo se verá el email cuando se envíe.'
          }
        </div>
      </div>
    </div>
  )
}
