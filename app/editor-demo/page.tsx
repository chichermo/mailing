'use client'

import RichTextEditor from '@/components/RichTextEditor'
import EditorPreview from '@/components/EditorPreview'
import EditorStats from '@/components/EditorStats'
import EditorTest from '@/components/EditorTest'

export default function EditorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Rich Text Editor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A professional interface to create rich HTML content with all the editing tools
            you need for your emails and templates.
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <a href="#live-editor" className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                Live Editor
              </a>
              <a href="#preview" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Preview
              </a>
              <a href="#test-suite" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Test Suite
              </a>
              <a href="#features" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Features
              </a>
            </nav>
          </div>
        </div>

        {/* Editor en Vivo */}
        <section id="live-editor" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Live Editor</h2>
            <p className="text-gray-600 mb-6">
              Try the editor in real time. Type, format, and see changes instantly.
            </p>
            
            <RichTextEditor
              value="<h1>Welcome to the Editor!</h1><p>This is a <strong>rich text editor</strong> with all the features you need.</p><ul><li>Text formatting</li><li>Colors and styles</li><li>Links and images</li><li>And much more...</li></ul>"
              onChange={(value) => console.log('Content updated:', value)}
              placeholder="Write your content here..."
              height="h-80"
              showToolbar={true}
            />
          </div>
        </section>

        {/* Preview */}
        <section id="preview" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👁️ Preview</h2>
            <p className="text-gray-600 mb-6">
              See how your content will look with an interface similar to Google Docs or Microsoft Word.
            </p>
            
            <EditorPreview />
          </div>
        </section>

        {/* Test Suite */}
        <section id="test-suite" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Test Suite</h2>
            <p className="text-gray-600 mb-6">
              Test all editor features systematically and verify everything works correctly.
            </p>
            
            <EditorTest />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Formato de Texto */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📝 Text Formatting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Bold, italic, underline</li>
                  <li>• Text and background colors</li>
                  <li>• Sizes and fonts</li>
                  <li>• Paragraph alignment</li>
                </ul>
              </div>

              {/* Estructura */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📋 Structure</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Bulleted lists</li>
                  <li>• Numbered lists</li>
                  <li>• Indentation and spacing</li>
                  <li>• Quotes and code blocks</li>
                </ul>
              </div>

              {/* Multimedia */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🖼️ Media</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Images from file</li>
                  <li>• Images from URL</li>
                  <li>• Embedded videos</li>
                  <li>• Custom tables</li>
                </ul>
              </div>

              {/* Enlaces */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">🔗 Links</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Insert links</li>
                  <li>• Edit existing links</li>
                  <li>• Remove links</li>
                  <li>• URL validation</li>
                </ul>
              </div>

              {/* Variables Dinámicas */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">✨ Dynamic Variables</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Compatible with {'{{firstName}}'}</li>
                  <li>• Template integration</li>
                  <li>• Automatic replacement</li>
                  <li>• Email personalization</li>
                </ul>
              </div>

              {/* Interfaz Profesional */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">🎨 Professional Interface</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Top menu bar</li>
                  <li>• Organized tools</li>
                  <li>• Responsive design</li>
                  <li>• Google Docs-like experience</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Statistics */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Editor Statistics</h2>
            <p className="text-gray-600 mb-6">
              The editor includes real-time content analytics to help you create effective emails.
            </p>
            
            <EditorStats 
              content="<h1>Sample Content</h1><p>This is an <strong>example</strong> of how the editor analyzes your content and provides useful stats.</p><ul><li>First item</li><li>Second item</li></ul><p>You can also <a href='#'>insert links</a> and images.</p>"
            />
          </div>
        </section>

        {/* Technical Information */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Technical Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>React Quill:</strong> Base rich text editor</li>
                  <li>• <strong>Next.js 14:</strong> React framework with App Router</li>
                  <li>• <strong>TypeScript:</strong> Static typing for safer development</li>
                  <li>• <strong>Tailwind CSS:</strong> Utility-first CSS framework</li>
                  <li>• <strong>Heroicons:</strong> High-quality SVG icons</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Technical Features</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>SSR Compatible:</strong> Dynamic import for Next.js</li>
                  <li>• <strong>Responsive:</strong> Works on all devices</li>
                  <li>• <strong>Accessible:</strong> Keyboard navigation and screen readers</li>
                  <li>• <strong>Customizable:</strong> Flexible tool configuration</li>
                  <li>• <strong>Integrated:</strong> Works seamlessly with existing templates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
