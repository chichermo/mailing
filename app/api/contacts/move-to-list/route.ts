import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Mover contactos a una lista específica
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

    const { data: contacts, error } = await supabaseAdmin
      .from('contacts')
      .select('id,list_names')
      .in('id', contactIds)

    if (error) {
      throw error
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found' },
        { status: 404 }
      )
    }

    let modifiedCount = 0
    for (const contact of contacts) {
      const currentLists: string[] = Array.isArray(contact.list_names) ? contact.list_names : []
      if (currentLists.includes(targetList)) {
        continue
      }

      const { error: updateError } = await supabaseAdmin
        .from('contacts')
        .update({ list_names: [...currentLists, targetList] })
        .eq('id', contact.id)

      if (updateError) {
        throw updateError
      }

      modifiedCount += 1
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${modifiedCount} contacts to ${targetList}`,
      modifiedCount
    })

  } catch (error) {
    console.error('Error moving contacts to list:', error)
    return NextResponse.json(
      { success: false, error: 'Error moving contacts to list' },
      { status: 500 }
    )
  }
}
