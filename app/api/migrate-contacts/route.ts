import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'

// POST - Migrar contactos existentes de listName a listNames
export async function POST() {
  try {
    const contactsCollection = await getCollection('contacts')
    
    // Obtener todos los contactos que aún tienen listName
    const contactsToMigrate = await contactsCollection.find({
      $or: [
        { listName: { $exists: true } },
        { listNames: { $exists: false } }
      ]
    }).toArray()

    if (contactsToMigrate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No contacts need migration',
        migratedCount: 0
      })
    }

    let migratedCount = 0

    // Migrar cada contacto
    for (const contact of contactsToMigrate) {
      try {
        const updateData: any = {}
        
        // Si tiene listName, convertirlo a listNames
        if (contact.listName) {
          updateData.listNames = [contact.listName]
          updateData.$unset = { listName: "" }
        } else {
          // Si no tiene listName ni listNames, asignar 'General'
          updateData.listNames = ['General']
        }

        await contactsCollection.updateOne(
          { _id: contact._id },
          updateData
        )
        
        migratedCount++
      } catch (error) {
        console.error(`Error migrating contact ${contact._id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} contacts`,
      migratedCount
    })

  } catch (error) {
    console.error('Error during migration:', error)
    return NextResponse.json(
      { success: false, error: 'Error during migration' },
      { status: 500 }
    )
  }
}
