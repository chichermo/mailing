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

    // Count characters (no spaces)
    const characters = content ? content.replace(/\s/g, '').length : 0
    
    // Count words
    const words = content ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0
    
    // Count lines
    const lines = content ? content.split('\n').filter(line => line.trim().length > 0).length : 0
    
    // Count images
    const images = content ? (content.match(/<img[^>]*>/gi) || []).length : 0
    
    // Count links
    const links = content ? (content.match(/<a[^>]*>/gi) || []).length : 0
    
    // Count HTML tags
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
        Content statistics
      </h4>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.words}</div>
          <div className="text-xs text-gray-500">Words</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.characters}</div>
          <div className="text-xs text-gray-500">Characters</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{stats.lines}</div>
          <div className="text-xs text-gray-500">Lines</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{stats.images}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <PhotoIcon className="w-3 h-3 mr-1" />
            Images
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.links}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <LinkIcon className="w-3 h-3 mr-1" />
            Links
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">{stats.htmlTags}</div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <CodeBracketIcon className="w-3 h-3 mr-1" />
            HTML tags
          </div>
        </div>
      </div>

      {/* Content-based tips */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          {stats.words < 50 && (
            <p className="text-amber-600">💡 Consider adding more content for a fuller email</p>
          )}
          {stats.images === 0 && (
            <p className="text-blue-600">💡 Images can make your email more engaging</p>
          )}
          {stats.links === 0 && (
            <p className="text-green-600">💡 Adding links can increase engagement</p>
          )}
          {stats.words > 200 && (
            <p className="text-gray-600">✅ Solid content, ideal for newsletters</p>
          )}
        </div>
      </div>
    </div>
  )
}
