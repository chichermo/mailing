import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Migrar contactos existentes de listName a listNames
export async function POST() {
  try {
    const { data: needsMigration, error: selectError } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .is('list_names', null)

    if (selectError) {
      throw selectError
    }

    if (!needsMigration || needsMigration.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No contacts need migration',
        migratedCount: 0
      })
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('contacts')
      .update({ list_names: ['General'] })
      .is('list_names', null)
      .select('id')

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${updated?.length || 0} contacts`,
      migratedCount: updated?.length || 0
    })

  } catch (error) {
    console.error('Error during migration:', error)
    return NextResponse.json(
      { success: false, error: 'Error during migration' },
      { status: 500 }
    )
  }
}
