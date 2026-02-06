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

// GET - Obtener plantilla por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('templates')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw error
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: mapTemplateFromDb(data) })
  } catch (error) {
    console.error('Error getting template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template' },
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, subject, and content are required' },
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

    const { data: updated } = await supabaseAdmin
      .from('templates')
      .select('id')
      .eq('id', id)
      .maybeSingle()

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Template updated successfully',
      updatedCount: 1
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update template' },
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('templates')
      .delete()
      .eq('id', id)
      .select('id')

    if (error) {
      throw error
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Template deleted successfully',
      deletedCount: data.length
    })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete template' },
      { status: 500 }
    )
  }
}
