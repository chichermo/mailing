'use client'

import { useMemo } from 'react'
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  LinkIcon, 
  CodeBracketIcon 
} from '@heroicons/react/24/outline'

interface EditorStatsProps {
  content: string
  className?: string
}

export default function EditorStats({ content, className = '' }: EditorStatsProps) {
  const stats = useMemo(() => {
    if (!content) {
      return {
        characters: 0,
        words: 0,
        lines: 0,
        images: 0,
        links: 0,
        htmlTags: 0
      }
    }

    // Contar caracteres (sin espacios)
    const characters = content ? content.replace(/\s/g, '').length : 0
    
    // Contar palabras
    const words = content ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0
    
    // Contar líneas
    const lines = content ? content.split('\n').filter(line => line.trim().length > 0).length : 0
    
    // Contar imágenes
    const images = content ? (content.match(/<img[^>]*>/gi) || []).length : 0
    
    // Contar enlaces
    const links = content ? (content.match(/<a[^>]*>/gi) || []).length : 0
    
    // Contar tags HTML
    const htmlTags = content ? (content.match(/<[^>]+>/g) || []).length : 0

    return {
      characters,
      words,
      lines,
      images,
      links,
      htmlTags
    }
  }, [content])

  if (!content || content.trim() === '') {
    return null
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <DocumentTextIcon className="w-4 h-4 mr-2" />
        Estadísticas del contenido
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.words}</div>
          <div className="text-xs text-gray-500">Palabras</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.characters}</div>
          <div className="text-xs text-gray-500">Caracteres</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.lines}</div>
          <div className="text-xs text-gray-500">Líneas</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{stats.images}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <PhotoIcon className="w-3 h-3 mr-1" />
            Imágenes
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.links}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <LinkIcon className="w-3 h-3 mr-1" />
            Enlaces
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{stats.htmlTags}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <CodeBracketIcon className="w-3 h-3 mr-1" />
            Tags HTML
          </div>
        </div>
      </div>

      {/* Consejos basados en el contenido */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          {stats.words < 50 && (
            <p className="text-amber-600">💡 Considera agregar más contenido para un email más completo</p>
          )}
          {stats.images === 0 && (
            <p className="text-blue-600">💡 Las imágenes pueden hacer tu email más atractivo</p>
          )}
          {stats.links === 0 && (
            <p className="text-green-600">💡 Incluir enlaces puede aumentar el engagement</p>
          )}
          {stats.words > 200 && (
            <p className="text-gray-600">✅ Contenido sustancial, ideal para newsletters</p>
          )}
        </div>
      </div>
    </div>
  )
}
