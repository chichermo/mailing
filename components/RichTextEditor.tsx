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
  PaletteIcon,
  PlusIcon,
  MinusIcon,
  TableCellsIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

// Importar ReactQuill dinámicamente para evitar problemas de SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
})

// Importar estilos de Quill
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string
  showToolbar?: boolean
}

// Iconos personalizados para los que no están en Heroicons
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
  placeholder = 'Escribe tu contenido aquí...',
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
  const quillRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Configuración de módulos de Quill
  const modules = {
    toolbar: false, // Deshabilitamos la toolbar por defecto para usar la personalizada
    clipboard: {
      matchVisual: false
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  }

  // Configuración de formatos permitidos
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'direction',
    'code-block', 'script'
  ]

  // Funciones del editor
  const formatText = (format: string, value?: any) => {
    if (quillRef.current) {
      quillRef.current.format(format, value)
    }
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      const range = quillRef.current?.getSelection()
      if (range) {
        quillRef.current?.insertEmbed(range.index, 'link', { href: linkUrl, text: linkText })
        setShowLinkDialog(false)
        setLinkUrl('')
        setLinkText('')
      }
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
          const range = quillRef.current?.getSelection()
          if (range) {
            quillRef.current?.insertEmbed(range.index, 'image', e.target?.result)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const insertImageFromUrl = () => {
    const url = prompt('Ingresa la URL de la imagen:')
    if (url) {
      const range = quillRef.current?.getSelection()
      if (range) {
        quillRef.current?.insertEmbed(range.index, 'image', url)
      }
    }
  }

  const insertTable = () => {
    const rows = prompt('Número de filas:', '3')
    const cols = prompt('Número de columnas:', '3')
    if (rows && cols) {
      // Implementar inserción de tabla
      console.log('Insertar tabla:', rows, cols)
    }
  }

  if (!mounted) {
    return (
      <div className={`${height} bg-gray-100 animate-pulse rounded-lg ${className}`}></div>
    )
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Barra de menú superior */}
      {showToolbar && (
        <div className="bg-gray-800 text-white border-b border-gray-700">
          <div className="flex items-center px-4 py-2 space-x-6 text-sm">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'edit' ? 'bg-gray-700' : ''}`}
            >
              Bewerken
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'format' ? null : 'format')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'format' ? 'bg-gray-700' : ''}`}
            >
              Opmaak
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
              Tabel
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'insert' ? null : 'insert')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'insert' ? 'bg-gray-700' : ''}`}
            >
              Invoegen
            </button>
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-3 py-1 rounded hover:bg-gray-700 ${activeMenu === 'view' ? 'bg-gray-700' : ''}`}
            >
              Beeld
            </button>
          </div>

          {/* Menús desplegables */}
          {activeMenu === 'edit' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={() => quillRef.current?.history.undo()} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <UndoIcon className="w-4 h-4 inline mr-2" />
                  Deshacer
                </button>
                <button onClick={() => quillRef.current?.history.redo()} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <RedoIcon className="w-4 h-4 inline mr-2" />
                  Rehacer
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
                  Imagen desde archivo
                </button>
                <button onClick={insertImageFromUrl} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <PhotoIcon className="w-4 h-4 inline mr-2" />
                  Imagen desde URL
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
                  Insertar tabla
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'insert' && (
            <div className="bg-gray-700 px-4 py-2 text-sm">
              <div className="flex items-center space-x-4">
                <button onClick={() => formatText('blockquote')} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <QuoteIcon className="w-4 h-4 inline mr-2" />
                  Cita
                </button>
                <button onClick={() => formatText('code-block')} className="hover:bg-gray-600 px-2 py-1 rounded">
                  <DocumentTextIcon className="w-4 h-4 inline mr-2" />
                  Código
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Barra de herramientas principal */}
      {showToolbar && (
        <div className="bg-gray-100 border-b border-gray-300 p-3">
          <div className="flex items-center space-x-4">
            {/* Formato de texto */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('bold')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Negrita"
              >
                <BoldIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('italic')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Cursiva"
              >
                <ItalicIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('underline')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Subrayado"
              >
                <UnderlineIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Colores */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-200 rounded transition-colors flex items-center"
                title="Color del texto"
              >
                <span className="text-red-500 font-bold text-sm">A</span>
                <MinusIcon className="w-3 h-3 ml-1" />
              </button>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Color de fondo"
              >
                <div className="w-4 h-4 border border-gray-400 rounded-sm bg-yellow-200"></div>
                <MinusIcon className="w-3 h-3" />
              </button>
            </div>

            {/* Enlaces */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowLinkDialog(true)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Insertar enlace"
              >
                <PlusIcon className="w-4 h-4" />
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('link', false)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Editar enlace"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('link', false)}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-400"
                title="Quitar enlace"
              >
                <LinkBreakIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Emoji */}
            <button className="p-2 hover:bg-gray-200 rounded transition-colors text-xl">
              😊
            </button>
          </div>

          {/* Segunda fila de herramientas */}
          <div className="flex items-center space-x-4 mt-3">
            {/* Alineación */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('align', 'left')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Alinear a la izquierda"
              >
                <AlignLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'center')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Centrar"
              >
                <AlignCenterIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'right')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Alinear a la derecha"
              >
                <AlignRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('align', 'justify')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Justificar"
              >
                <AlignJustifyIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Listas */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => formatText('list', 'bullet')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Lista con viñetas"
              >
                <ListBulletIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => formatText('list', 'ordered')}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Lista numerada"
              >
                <ListNumberedIcon className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                <MinusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selector de colores */}
          {showColorPicker && (
            <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
              <div className="grid grid-cols-8 gap-2">
                {['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef',
                  '#f2f2f2', '#f7f7f7', '#ffffff', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
                  '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#e6b8af', '#f4cccc', '#fce5cd',
                  '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc', '#dd7e6b',
                  '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a6d6', '#d5a6bd'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      formatText('color', color)
                      setShowColorPicker(false)
                    }}
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

      {/* Editor principal */}
      <div className={`${height} border border-gray-300 rounded-b-lg ${!showToolbar ? 'rounded-t-lg' : ''}`}>
        <ReactQuill
          ref={quillRef}
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

      {/* Diálogo de enlace */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insertar enlace</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del enlace:</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Texto a mostrar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL:</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={insertLink}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Insertar
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información de ayuda */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Consejos:</strong></p>
        <ul className="ml-4 space-y-1">
          <li>• Usa la barra de menú superior para acceder a opciones avanzadas</li>
          <li>• La barra de herramientas te permite formatear texto rápidamente</li>
          <li>• Puedes insertar imágenes, enlaces y tablas desde los menús</li>
          <li>• Las variables como {'{{firstName}}'} se reemplazarán automáticamente</li>
        </ul>
      </div>
    </div>
  )
}
