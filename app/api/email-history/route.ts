import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Obtener historial de emails
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    const mapped = (data || []).map((campaign: any) => {
      const listName = Array.isArray(campaign.list_names) && campaign.list_names.length > 0
        ? campaign.list_names[0]
        : 'all'

      return {
        id: campaign.id,
        name: campaign.template_name || 'Custom Campaign',
        template_id: campaign.template_id,
        template_name: campaign.template_name || 'Custom Campaign',
        list_name: listName,
        subject: campaign.custom_subject || '',
        total_sent: campaign.total_sent || 0,
        success_count: campaign.success_count || 0,
        error_count: campaign.error_count || 0,
        created_at: campaign.created_at
      }
    })

    return NextResponse.json({ success: true, data: mapped })
  } catch (error) {
    console.error('Error getting email history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar campaña del historial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('campaigns').delete().eq('id', id)
    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete campaign' },
      { status: 500 }
    )
  }
}
