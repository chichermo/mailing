import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const mapTemplateFromDb = (row: any) => ({
  _id: row.id,
  name: row.name,
  subject: row.subject,
  content: row.content,
  variables: row.variables,
  createdAt: row.created_at
})

// GET - Obtener plantillas
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: (data || []).map(mapTemplateFromDb) })
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

    const newTemplate = {
      name,
      subject,
      content,
      variables: variables || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('templates')
      .insert(newTemplate)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: mapTemplateFromDb(data)
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

    const { error } = await supabaseAdmin
      .from('templates')
      .update({
        name,
        subject,
        content,
        variables: variables || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      throw error
    }

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

    const { error } = await supabaseAdmin.from('templates').delete().eq('id', id)
    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar plantilla' },
      { status: 500 }
    )
  }
}
