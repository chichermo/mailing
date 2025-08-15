'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  ListBulletIcon, 
  ListNumberedIcon,
  QuoteIcon,
  LinkIcon,
  ImageIcon,
  PaletteIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  UndoIcon,
  RedoIcon
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

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe tu contenido aquí...',
  className = '',
  height = 'h-64',
  showToolbar = true
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Configuración de módulos de Quill
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: () => {
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
      }
    },
    clipboard: {
      matchVisual: false
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

  // Función para insertar imagen desde URL
  const insertImageFromUrl = () => {
    const url = prompt('Ingresa la URL de la imagen:')
    if (url) {
      const range = quillRef.current?.getSelection()
      if (range) {
        quillRef.current?.insertEmbed(range.index, 'image', url)
      }
    }
  }

  // Función para cambiar color del texto
  const changeTextColor = () => {
    const color = prompt('Ingresa el color (nombre o código hex):', '#000000')
    if (color) {
      quillRef.current?.format('color', color)
    }
  }

  // Función para cambiar color de fondo
  const changeBackgroundColor = () => {
    const color = prompt('Ingresa el color de fondo (nombre o código hex):', '#ffffff')
    if (color) {
      quillRef.current?.format('background', color)
    }
  }

  // Función para insertar enlace
  const insertLink = () => {
    const url = prompt('Ingresa la URL del enlace:')
    if (url) {
      const range = quillRef.current?.getSelection()
      if (range && range.length > 0) {
        quillRef.current?.format('link', url)
      } else {
        quillRef.current?.insertText(range.index, url, 'link', url)
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
      {/* Toolbar personalizado */}
      {showToolbar && (
        <div className="custom-toolbar p-2 flex flex-wrap items-center gap-1">
          {/* Formato de texto */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={() => quillRef.current?.format('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Negrita"
            >
              <BoldIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Cursiva"
            >
              <ItalicIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Subrayado"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Listas */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={() => quillRef.current?.format('list', 'bullet')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Lista con viñetas"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('list', 'ordered')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Lista numerada"
            >
              <ListNumberedIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('blockquote')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Cita"
            >
              <QuoteIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Enlaces e imágenes */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={insertLink}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insertar enlace"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertImageFromUrl}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insertar imagen desde URL"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Colores */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={changeTextColor}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Color del texto"
            >
              <PaletteIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={changeBackgroundColor}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Color de fondo"
            >
              <div className="w-4 h-4 border border-gray-400 rounded-sm bg-gradient-to-br from-white to-gray-200"></div>
            </button>
          </div>

          {/* Alineación */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button
              type="button"
              onClick={() => quillRef.current?.format('align', 'left')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Alinear a la izquierda"
            >
              <AlignLeftIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('align', 'center')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Centrar"
            >
              <AlignCenterIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('align', 'right')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Alinear a la derecha"
            >
              <AlignRightIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.format('align', 'justify')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Justificar"
            >
              <AlignJustifyIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Deshacer/Rehacer */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => quillRef.current?.history.undo()}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Deshacer"
            >
              <UndoIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => quillRef.current?.history.redo()}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Rehacer"
            >
              <RedoIcon className="w-4 h-4" />
            </button>
          </div>
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

      {/* Información de ayuda */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Consejos:</strong></p>
        <ul className="ml-4 space-y-1">
          <li>• Usa la barra de herramientas para formatear tu texto</li>
          <li>• Puedes insertar imágenes arrastrando archivos o usando el botón de imagen</li>
          <li>• Las variables como {'{{firstName}}'} se reemplazarán automáticamente</li>
          <li>• El contenido se guarda en formato HTML</li>
        </ul>
      </div>
    </div>
  )
}
