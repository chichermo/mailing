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
            ✨ Editor de Texto Enriquecido
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una interfaz profesional para crear contenido rico en HTML con todas las herramientas 
            de edición que necesitas para tus emails y templates.
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <a href="#live-editor" className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                Editor en Vivo
              </a>
              <a href="#preview" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Vista Previa
              </a>
              <a href="#test-suite" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Suite de Tests
              </a>
              <a href="#features" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Características
              </a>
            </nav>
          </div>
        </div>

        {/* Editor en Vivo */}
        <section id="live-editor" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Editor en Vivo</h2>
            <p className="text-gray-600 mb-6">
              Prueba el editor en tiempo real. Escribe, formatea y ve los cambios instantáneamente.
            </p>
            
            <RichTextEditor
              value="<h1>¡Bienvenido al Editor!</h1><p>Este es un <strong>editor de texto enriquecido</strong> con todas las funcionalidades que necesitas.</p><ul><li>Formato de texto</li><li>Colores y estilos</li><li>Enlaces e imágenes</li><li>Y mucho más...</li></ul>"
              onChange={(value) => console.log('Contenido actualizado:', value)}
              placeholder="Escribe tu contenido aquí..."
              height="h-80"
              showToolbar={true}
            />
          </div>
        </section>

        {/* Vista Previa */}
        <section id="preview" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👁️ Vista Previa</h2>
            <p className="text-gray-600 mb-6">
              Ve cómo se verá tu contenido con una interfaz similar a Google Docs o Microsoft Word.
            </p>
            
            <EditorPreview />
          </div>
        </section>

        {/* Suite de Tests */}
        <section id="test-suite" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧪 Suite de Tests</h2>
            <p className="text-gray-600 mb-6">
              Prueba todas las funcionalidades del editor de manera sistemática y verifica que todo funcione correctamente.
            </p>
            
            <EditorTest />
          </div>
        </section>

        {/* Características */}
        <section id="features" className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Características Principales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Formato de Texto */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📝 Formato de Texto</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Negrita, cursiva, subrayado</li>
                  <li>• Colores de texto y fondo</li>
                  <li>• Tamaños y fuentes</li>
                  <li>• Alineación de párrafos</li>
                </ul>
              </div>

              {/* Estructura */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">📋 Estructura</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Listas con viñetas</li>
                  <li>• Listas numeradas</li>
                  <li>• Sangría y espaciado</li>
                  <li>• Citas y bloques de código</li>
                </ul>
              </div>

              {/* Multimedia */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">🖼️ Multimedia</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Imágenes desde archivo</li>
                  <li>• Imágenes desde URL</li>
                  <li>• Videos embebidos</li>
                  <li>• Tablas personalizadas</li>
                </ul>
              </div>

              {/* Enlaces */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">🔗 Enlaces</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Insertar enlaces</li>
                  <li>• Editar enlaces existentes</li>
                  <li>• Quitar enlaces</li>
                  <li>• Validación de URLs</li>
                </ul>
              </div>

              {/* Variables Dinámicas */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">✨ Variables Dinámicas</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Compatible con {'{{firstName}}'}</li>
                  <li>• Integración con templates</li>
                  <li>• Reemplazo automático</li>
                  <li>• Personalización de emails</li>
                </ul>
              </div>

              {/* Interfaz Profesional */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900 mb-2">🎨 Interfaz Profesional</h3>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• Barra de menú superior</li>
                  <li>• Herramientas organizadas</li>
                  <li>• Diseño responsive</li>
                  <li>• Experiencia tipo Google Docs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas del Editor */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Estadísticas del Editor</h2>
            <p className="text-gray-600 mb-6">
              El editor incluye análisis en tiempo real del contenido para ayudarte a crear emails efectivos.
            </p>
            
            <EditorStats 
              content="<h1>Ejemplo de Contenido</h1><p>Este es un <strong>ejemplo</strong> de cómo el editor analiza tu contenido y te proporciona estadísticas útiles.</p><ul><li>Primer elemento</li><li>Segundo elemento</li></ul><p>También puedes <a href='#'>insertar enlaces</a> e imágenes.</p>"
            />
          </div>
        </section>

        {/* Información Técnica */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Información Técnica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tecnologías Utilizadas</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>React Quill:</strong> Editor de texto enriquecido base</li>
                  <li>• <strong>Next.js 14:</strong> Framework de React con App Router</li>
                  <li>• <strong>TypeScript:</strong> Tipado estático para mayor seguridad</li>
                  <li>• <strong>Tailwind CSS:</strong> Framework de CSS utilitario</li>
                  <li>• <strong>Heroicons:</strong> Iconos SVG de alta calidad</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Características Técnicas</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>SSR Compatible:</strong> Importación dinámica para Next.js</li>
                  <li>• <strong>Responsive:</strong> Funciona en todos los dispositivos</li>
                  <li>• <strong>Accesible:</strong> Navegación por teclado y lectores de pantalla</li>
                  <li>• <strong>Personalizable:</strong> Configuración flexible de herramientas</li>
                  <li>• <strong>Integrado:</strong> Funciona perfectamente con templates existentes</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
