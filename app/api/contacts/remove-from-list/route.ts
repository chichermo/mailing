import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// POST - Remover contactos de una lista específica
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

    // Remover la lista específica de listNames para todos los contactos seleccionados
    const result = await contactsCollection.updateMany(
      { _id: { $in: objectIds } },
      { 
        $pull: { listNames: targetList } // $pull remueve el elemento del array
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
      message: `Successfully removed ${result.modifiedCount} contacts from ${targetList}`,
      modifiedCount: result.modifiedCount
    })

  } catch (error) {
    console.error('Error removing contacts from list:', error)
    return NextResponse.json(
      { success: false, error: 'Error removing contacts from list' },
      { status: 500 }
    )
  }
}
