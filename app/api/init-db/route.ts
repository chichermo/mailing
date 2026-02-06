import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔄 Checking Supabase connection via init-db route...')

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados'
        },
        { status: 500 }
      )
    }

    const { error } = await supabaseAdmin.from('contacts').select('id').limit(1)
    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection verified'
    })
  } catch (error) {
    console.error('❌ Error during database verification:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
