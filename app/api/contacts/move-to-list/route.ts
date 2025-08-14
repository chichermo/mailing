import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// POST - Mover contactos a una lista específica
export async function POST(request: NextRequest) {
  try {
    const { contactIds, targetList } = await request.json()

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact IDs are required' },
        { status: 400 }
      )
    }

    if (!targetList || typeof targetList !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Target list is required' },
        { status: 400 }
      )
    }

    const contactsCollection = await getCollection('contacts')

    // Convertir IDs a ObjectId
    const objectIds = contactIds.map(id => new ObjectId(id))

    // Actualizar todos los contactos seleccionados
    // Agregar la nueva lista a listNames si no existe
    const result = await contactsCollection.updateMany(
      { _id: { $in: objectIds } },
      { 
        $addToSet: { listNames: targetList } // $addToSet evita duplicados
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${result.modifiedCount} contacts to ${targetList}`,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Error moving contacts to list:', error)
    return NextResponse.json(
      { success: false, error: 'Error moving contacts to list' },
      { status: 500 }
    )
  }
}
