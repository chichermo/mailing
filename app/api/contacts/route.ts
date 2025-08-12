import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET - Obtener lista de contactos
export async function GET() {
  try {
    const contactsCollection = await getCollection('contacts')
    const contacts = await contactsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error getting contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, phone, listName } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const contactsCollection = await getCollection('contacts')

    // Verificar si el email ya existe
    const existing = await contactsCollection.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'El email ya existe' },
        { status: 400 }
      )
    }

    const newContact = {
      firstName,
      lastName,
      email,
      company: company || '',
      phone: phone || '',
      listName: listName || 'General',
      createdAt: new Date()
    }

    const result = await contactsCollection.insertOne(newContact)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newContact }
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear contacto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar contacto
export async function PUT(request: NextRequest) {
  try {
    const { id, firstName, lastName, email, company, phone, listName } = await request.json()

    if (!id || !email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'ID, email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const contactsCollection = await getCollection('contacts')

    // Verificar si el email ya existe en otro contacto
    const existing = await contactsCollection.findOne({ email, _id: { $ne: new ObjectId(id) } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'El email ya existe en otro contacto' },
        { status: 400 }
      )
    }

    await contactsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          firstName,
          lastName,
          email,
          company: company || '',
          phone: phone || '',
          listName: listName || 'General'
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar contacto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      )
    }

    const contactsCollection = await getCollection('contacts')
    await contactsCollection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
