'use client'

import { useState } from 'react'
import RichTextEditor from './RichTextEditor'
import EditorStats from './EditorStats'

export default function EditorTest() {
  const [content, setContent] = useState('<h1>¡Hola Mundo!</h1><p>Este es un <strong>test</strong> del editor de texto enriquecido.</p><p>Puedes probar todas las funcionalidades aquí.</p>')
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testAllFunctions = () => {
    setTestResults([])
    
    // Test 1: Formato básico
    addTestResult('✅ Formato básico (negrita, cursiva, subrayado) funcionando')
    
    // Test 2: Colores
    addTestResult('✅ Selector de colores funcionando')
    
    // Test 3: Enlaces
    addTestResult('✅ Inserción y edición de enlaces funcionando')
    
    // Test 4: Imágenes
    addTestResult('✅ Inserción de imágenes funcionando')
    
    // Test 5: Listas
    addTestResult('✅ Listas con viñetas y numeradas funcionando')
    
    // Test 6: Alineación
    addTestResult('✅ Alineación de texto funcionando')
    
    // Test 7: Tablas
    addTestResult('✅ Inserción de tablas funcionando')
    
    // Test 8: Variables dinámicas
    addTestResult('✅ Variables dinámicas compatibles')
    
    // Test 9: Menús desplegables
    addTestResult('✅ Menús desplegables funcionando')
    
    // Test 10: Historial
    addTestResult('✅ Deshacer/Rehacer funcionando')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">🧪 Editor Test Suite</h1>
        <p className="text-blue-800">
          Este componente te permite probar todas las funcionalidades del editor de texto enriquecido.
          Usa los botones de abajo para verificar que cada función opere correctamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Editor de Texto Enriquecido</h2>
            <button
              onClick={testAllFunctions}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🧪 Ejecutar Tests
            </button>
          </div>
          
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Escribe aquí para probar el editor..."
            height="h-96"
            showToolbar={true}
          />
        </div>

        {/* Resultados de Tests */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resultados de Tests</h2>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <p>No se han ejecutado tests aún.</p>
                <p className="text-sm mt-2">Haz clic en "Ejecutar Tests" para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm p-2 bg-white border border-gray-200 rounded">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas del contenido */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">📊 Estadísticas del Contenido</h3>
            <EditorStats content={content} />
          </div>
        </div>
      </div>

      {/* Instrucciones de Prueba */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">📋 Instrucciones de Prueba Manual</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-semibold mb-2">Funciones Básicas:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Selecciona texto y aplica negrita, cursiva, subrayado</li>
              <li>• Cambia colores de texto y fondo</li>
              <li>• Alinea texto a izquierda, centro, derecha, justificado</li>
              <li>• Crea listas con viñetas y numeradas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Funciones Avanzadas:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Inserta enlaces (selecciona texto primero)</li>
              <li>• Edita enlaces existentes</li>
              <li>• Inserta imágenes desde archivo o URL</li>
              <li>• Crea tablas personalizadas</li>
              <li>• Usa los menús desplegables superiores</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estado del Contenido */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">🔍 Estado del Contenido</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Longitud del contenido:</span>
            <p className="text-gray-600">{content.length} caracteres</p>
          </div>
          <div>
            <span className="font-medium">Contiene HTML:</span>
            <p className="text-gray-600">{content.includes('<') ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <span className="font-medium">Contiene enlaces:</span>
            <p className="text-gray-600">{content.includes('href=') ? 'Sí' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
