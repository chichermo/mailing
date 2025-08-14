import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// DELETE - Eliminar múltiples contactos
export async function DELETE(request: NextRequest) {
  try {
    const { contactIds } = await request.json()

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact IDs are required' },
        { status: 400 }
      )
    }

    const contactsCollection = await getCollection('contacts')

    // Convertir IDs a ObjectId
    const objectIds = contactIds.map(id => new ObjectId(id))

    // Eliminar todos los contactos seleccionados
    const result = await contactsCollection.deleteMany({
      _id: { $in: objectIds }
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found to delete' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} contacts`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error('Error deleting multiple contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Error deleting contacts' },
      { status: 500 }
    )
  }
}
