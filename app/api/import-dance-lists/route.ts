import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import fs from 'fs'
import path from 'path'

// POST - Importar listas de danza desde archivos reales
export async function POST() {
  try {
    const contactsCollection = await getCollection('contacts')
    
    // Ruta a la carpeta de archivos de mails
    const mailsFolder = path.join(process.cwd(), '..', 'mails', 'OneDrive_12_14-8-2025')
    
    // Verificar si la carpeta existe
    if (!fs.existsSync(mailsFolder)) {
      return NextResponse.json({
        success: false,
        error: `Carpeta de mails no encontrada: ${mailsFolder}`
      }, { status: 404 })
    }
    
    // Leer todos los archivos .txt en la carpeta
    const files = fs.readdirSync(mailsFolder).filter(file => file.endsWith('.txt'))
    
    console.log(`📁 Archivos encontrados: ${files.length}`)
    console.log(`📁 Archivos:`, files)
    
    let totalContactsCreated = 0
    let totalContactsUpdated = 0
    const errors: string[] = []
    const processedLists: string[] = []
    
    // Procesar cada archivo
    for (const file of files) {
      try {
        const filePath = path.join(mailsFolder, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        
        // Extraer nombre de la lista del nombre del archivo
        const listName = file
          .replace('Dansgroep Heliopsis vzw - ', '')
          .replace(' - Werkjaar 2024-2025.txt', '')
          .replace('.txt', '')
        
        console.log(`📋 Procesando lista: ${listName}`)
        
        // Parsear el contenido del archivo
        const lines = fileContent.split('\n').filter(line => line.trim())
        const contacts = []
        
        for (const line of lines) {
          // Saltar líneas de encabezado
          if (line.startsWith('Contact Group Name:') || line.startsWith('Members:') || line.trim() === '') {
            continue
          }
          
          // Parsear línea de contacto: "Nombre Apellido	email@domain.com"
          const parts = line.split('\t')
          if (parts.length >= 2) {
            const namePart = parts[0].trim()
            const email = parts[1].trim()
            
            // Extraer nombre y apellido
            const nameParts = namePart.split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''
            
            if (email && email.includes('@')) {
              contacts.push({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim()
              })
            }
          }
        }
        
        console.log(`👥 Contactos encontrados en ${listName}: ${contacts.length}`)
        
        // Procesar contactos de esta lista
        for (const contactData of contacts) {
          try {
            // Verificar si el contacto ya existe
            const existingContact = await contactsCollection.findOne({ 
              email: contactData.email 
            })

            if (existingContact) {
              // Si existe, agregar la nueva lista a listNames
              await contactsCollection.updateOne(
                { _id: existingContact._id },
                { 
                  $addToSet: { listNames: listName } // Agregar lista sin duplicados
                }
              )
              totalContactsUpdated++
              console.log(`✅ Actualizado: ${contactData.email} - agregado a ${listName}`)
            } else {
              // Si no existe, crear nuevo contacto
              const newContact = {
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                company: '',
                phone: '',
                listNames: [listName],
                createdAt: new Date()
              }

              await contactsCollection.insertOne(newContact)
              totalContactsCreated++
              console.log(`🆕 Creado: ${contactData.email} en ${listName}`)
            }
          } catch (error) {
            const errorMsg = `Error procesando ${contactData.email}: ${error}`
            console.error(errorMsg)
            errors.push(errorMsg)
          }
        }
        
        processedLists.push(listName)
        
      } catch (error) {
        const errorMsg = `Error procesando archivo ${file}: ${error}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Importación completada exitosamente`,
      summary: {
        filesProcessed: files.length,
        listsProcessed: processedLists.length,
        contactsCreated: totalContactsCreated,
        contactsUpdated: totalContactsUpdated,
        errors: errors.length
      },
      processedLists: processedLists,
      errors: errors
    })

  } catch (error) {
    console.error('Error durante la importación:', error)
    return NextResponse.json(
      { success: false, error: `Error durante la importación: ${error}` },
      { status: 500 }
    )
  }
}
