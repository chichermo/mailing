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
  ListNumberedIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline'

interface EditorPreviewProps {
  className?: string
}

// Iconos personalizados para los que no están en Heroicons
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

export default function EditorPreview({ className = '' }: EditorPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'features' | 'code'>('preview')

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header con tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Editor de Texto Enriquecido</h3>
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
              Vista Previa
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
              Características
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
              Código
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de los tabs */}
      <div className="p-6">
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Barra de menú superior simulada */}
            <div className="bg-gray-800 text-white rounded-t-lg">
              <div className="flex items-center px-4 py-2 space-x-6 text-sm">
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Bewerken</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Opmaak</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Media</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Tabel</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Invoegen</span>
                <span className="px-3 py-1 rounded hover:bg-gray-700 cursor-pointer">Beeld</span>
              </div>
            </div>

            {/* Barra de herramientas simulada */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <div className="flex items-center space-x-4 mb-4">
                {/* Fuente y tamaño */}
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

                {/* Formato de texto */}
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

                {/* Colores */}
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

                {/* Enlaces */}
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

              {/* Segunda fila */}
              <div className="flex items-center space-x-4">
                {/* Alineación */}
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

                {/* Listas */}
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

            {/* Área de contenido simulada */}
            <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-40">
              <div className="prose max-w-none">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Bienvenido al Editor Profesional!</h1>
                <p className="text-gray-700 mb-4">
                  Este es un ejemplo de cómo se verá tu contenido cuando uses el editor de texto enriquecido.
                  Puedes <strong>formatear texto</strong>, <em>cambiar colores</em>, y <u>insertar elementos multimedia</u>.
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700">
                  <li>Inserción de imágenes desde archivos o URLs</li>
                  <li>Creación de enlaces profesionales</li>
                  <li>Formato avanzado de texto</li>
                  <li>Tablas y elementos estructurales</li>
                </ul>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                  "Un editor de texto enriquecido que rivaliza con las mejores herramientas del mercado."
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">🎨 Formato de Texto</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Negrita, cursiva, subrayado</strong></li>
                <li>• <strong>Colores personalizables</strong> de texto y fondo</li>
                <li>• <strong>Múltiples fuentes</strong> y tamaños</li>
                <li>• <strong>Encabezados</strong> H1-H6</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">🖼️ Multimedia</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Imágenes</strong> desde archivos o URLs</li>
                <li>• <strong>Videos</strong> embebidos</li>
                <li>• <strong>Enlaces</strong> profesionales</li>
                <li>• <strong>Tablas</strong> personalizables</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">📱 Interfaz</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Barra de menú</strong> superior profesional</li>
                <li>• <strong>Herramientas</strong> organizadas por categorías</li>
                <li>• <strong>Diseño responsive</strong> para todos los dispositivos</li>
                <li>• <strong>Accesibilidad</strong> mejorada</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">⚡ Funcionalidades</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Historial</strong> de cambios (deshacer/rehacer)</li>
                <li>• <strong>Vista previa</strong> en tiempo real</li>
                <li>• <strong>Variables dinámicas</strong> para emails</li>
                <li>• <strong>Exportación</strong> a HTML</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">🔧 Implementación Técnica</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm font-mono">
{`// Componente principal del editor
import RichTextEditor from './RichTextEditor'

// Uso básico
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Escribe tu contenido aquí..."
  height="h-80"
/>

// Configuración avanzada
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
              <h5 className="text-sm font-medium text-blue-900 mb-2">Características técnicas:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Basado en React Quill para máxima compatibilidad</li>
                <li>• TypeScript completo para desarrollo seguro</li>
                <li>• Estilos CSS personalizados y responsivos</li>
                <li>• Integración perfecta con Next.js</li>
                <li>• Soporte para SSR y hidratación</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
