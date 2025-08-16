import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET - Obtener plantilla por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      )
    }

    const templatesCollection = await getCollection('templates')
    const template = await templatesCollection.findOne({ _id: new ObjectId(id) })

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Plantilla no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: template })
  } catch (error) {
    console.error('Error getting template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener plantilla' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar plantilla por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { name, subject, content, variables } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      )
    }

    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Nombre, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    const templatesCollection = await getCollection('templates')

    const result = await templatesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          subject,
          content,
          variables: variables || [],
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Plantilla no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Plantilla actualizada correctamente',
      updatedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar plantilla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar plantilla por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID inválido' },
        { status: 400 }
      )
    }

    const templatesCollection = await getCollection('templates')
    const result = await templatesCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Plantilla no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Plantilla eliminada correctamente',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar plantilla' },
      { status: 500 }
    )
  }
}
