import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET - Obtener plantillas
export async function GET() {
  try {
    const templatesCollection = await getCollection('templates')
    const templates = await templatesCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error('Error getting templates:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener plantillas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva plantilla
export async function POST(request: NextRequest) {
  try {
    const { name, subject, content, variables } = await request.json()

    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Nombre, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    const templatesCollection = await getCollection('templates')

    const newTemplate = {
      name,
      subject,
      content,
      variables: variables || [],
      createdAt: new Date()
    }

    const result = await templatesCollection.insertOne(newTemplate)

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newTemplate }
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear plantilla' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar plantilla
export async function PUT(request: NextRequest) {
  try {
    const { id, name, subject, content, variables } = await request.json()

    if (!id || !name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'ID, nombre, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    const templatesCollection = await getCollection('templates')

    await templatesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          subject,
          content,
          variables: variables || []
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar plantilla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar plantilla
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

    const templatesCollection = await getCollection('templates')
    await templatesCollection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar plantilla' },
      { status: 500 }
    )
  }
}
