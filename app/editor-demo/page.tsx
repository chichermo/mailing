'use client'

import { useState } from 'react'
import RichTextEditor from '../../components/RichTextEditor'
import EditorPreview from '../../components/EditorPreview'
import EditorStats from '../../components/EditorStats'

export default function EditorDemo() {
  const [content, setContent] = useState('<h1>¡Bienvenido al Editor Profesional!</h1><p>Este es un ejemplo de contenido que puedes crear con el editor de texto enriquecido.</p>')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Editor de Texto Enriquecido Profesional
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una herramienta de edición completa que rivaliza con las mejores aplicaciones del mercado. 
            Crea contenido atractivo y profesional para tus emails.
          </p>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Editor en vivo */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ✏️ Editor en Vivo
              </h2>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Escribe tu contenido aquí..."
                height="h-96"
                className="w-full"
              />
            </div>

            {/* Estadísticas */}
            <EditorStats content={content} />
          </div>

          {/* Vista previa */}
          <div className="space-y-6">
            <EditorPreview />
            
            {/* Información adicional */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🚀 Características Destacadas
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Barra de menú superior profesional (como en la imagen)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Herramientas organizadas por categorías</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Inserción de imágenes desde archivos y URLs</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Selector de colores avanzado</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Creación de enlaces profesionales</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Formato de texto completo (negrita, cursiva, etc.)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span>Diseño responsive para móviles y desktop</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de comparación */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            🎯 ¿Por qué elegir nuestro editor?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interfaz Profesional</h3>
              <p className="text-gray-600 text-sm">
                Diseño similar a Google Docs y Microsoft Word, familiar y fácil de usar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Funcionalidades Avanzadas</h3>
              <p className="text-gray-600 text-sm">
                Todo lo que necesitas para crear contenido profesional: imágenes, enlaces, colores, tablas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600 text-sm">
                Funciona perfectamente en todos los dispositivos, desde móviles hasta pantallas grandes
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              ¡Comienza a crear contenido profesional hoy mismo!
            </h2>
            <p className="text-xl mb-6 opacity-90">
              El editor está completamente integrado en tu sistema de emails
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ir a Email Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
