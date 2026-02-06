import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id')

    if (error) {
      throw error
    }

    const deletedCount = data?.length || 0
    console.log(`🗑️ Deleted ${deletedCount} contacts from database`)

    const { count: finalCount, error: countError } = await supabaseAdmin
      .from('contacts')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      throw countError
    }
    
    return NextResponse.json({
      success: true,
      message: `Database reset successfully. Deleted ${deletedCount} contacts.`,
      deletedCount,
      finalTotalContacts: finalCount || 0
    })

  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
