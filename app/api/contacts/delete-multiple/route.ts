import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .delete()
      .in('id', contactIds)
      .select('id')

    if (error) {
      throw error
    }

    const deletedCount = data?.length || 0

    if (deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found to delete' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount} contacts`,
      deletedCount
    })

  } catch (error) {
    console.error('Error deleting multiple contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Error deleting contacts' },
      { status: 500 }
    )
  }
}
