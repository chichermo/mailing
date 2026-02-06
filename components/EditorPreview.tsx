'use client'

import { useState } from 'react'
import { 
  EyeIcon, 
  CodeBracketIcon, 
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  TableCellsIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

interface EditorPreviewProps {
  className?: string
}

// Custom icons for missing Heroicons
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

const LinkBreakIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

const ListNumberedIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
)

export default function EditorPreview({ className = '' }: EditorPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'features' | 'code'>('preview')

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header with tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Rich Text Editor</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <EyeIcon className="w-4 h-4 inline mr-2" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'features'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <DocumentTextIcon className="w-4 h-4 inline mr-2" />
              Features
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <CodeBracketIcon className="w-4 h-4 inline mr-2" />
              Code
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Simulated top menu bar */}
            <div className="bg-gray-800 text-white rounded-t-lg">
              <div className="flex items-center px-4 py-2 space-x-6 text-sm">
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Edit</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Format</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Media</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Table</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Insert</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">View</span>
              </div>
            </div>

            {/* Simulated toolbar */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                {/* Font and size */}
                <select className="bg-white border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Open Sans</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
                <select className="bg-white border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>12px</option>
                  <option>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>

                {/* Text formatting */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <BoldIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <ItalicIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <UnderlineIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Colors */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center">
                    <span className="text-red-500 font-bold text-sm">A</span>
                    <MinusIcon className="w-3 h-3 ml-1" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <div className="w-4 h-4 border border-gray-400 rounded-sm bg-yellow-200"></div>
                    <MinusIcon className="w-3 h-3" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-400">
                    <LinkBreakIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Emoji */}
                <button className="p-2 hover:bg-gray-200 rounded transition-colors text-xl">
                  😊
                </button>
              </div>

              {/* Second row */}
              <div className="flex items-center space-x-4">
                {/* Alignment */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <AlignLeftIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <AlignCenterIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <AlignRightIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <AlignJustifyIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Lists */}
                <div className="flex items-center space-x-1">
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <ListBulletIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <ListNumberedIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated content area */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-40">
              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Professional Editor!</h1>
                <p className="text-gray-700 mb-4">
                  This is an example of how your content will look when using the rich text editor.
                  You can <strong>format text</strong>, <em>change colors</em>, and <u>insert media</u>.
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Insert images from files or URLs</li>
                  <li>Create professional links</li>
                  <li>Advanced text formatting</li>
                  <li>Tables and structured elements</li>
                </ul>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                  "A rich text editor that rivals the best tools on the market."
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">🎨 Text Formatting</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Bold, italic, underline</strong></li>
                <li>• <strong>Custom colors</strong> for text and background</li>
                <li>• <strong>Multiple fonts</strong> and sizes</li>
                <li>• <strong>Headings</strong> H1-H6</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">🖼️ Media</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Images</strong> from files or URLs</li>
                <li>• <strong>Embedded videos</strong></li>
                <li>• <strong>Professional links</strong></li>
                <li>• <strong>Custom tables</strong></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">📱 Interface</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Professional top menu bar</strong></li>
                <li>• <strong>Tools</strong> organized by category</li>
                <li>• <strong>Responsive design</strong> for all devices</li>
                <li>• <strong>Improved accessibility</strong></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">⚡ Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Change history</strong> (undo/redo)</li>
                <li>• <strong>Live preview</strong> in real time</li>
                <li>• <strong>Dynamic variables</strong> for emails</li>
                <li>• <strong>Export</strong> to HTML</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">🔧 Technical Implementation</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm font-mono">
{`// Main editor component
import RichTextEditor from './RichTextEditor'

// Basic usage
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your content here..."
  height="h-80"
/>

// Advanced configuration
<RichTextEditor
  value={content}
  onChange={setContent}
  showToolbar={true}
  height="h-96"
  className="custom-editor"
/>`}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Technical features:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Built on React Quill for maximum compatibility</li>
                <li>• Full TypeScript for safer development</li>
                <li>• Custom, responsive CSS styles</li>
                <li>• Seamless Next.js integration</li>
                <li>• SSR and hydration support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
