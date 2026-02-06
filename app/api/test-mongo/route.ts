import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- SUPABASE_URL exists:', !!process.env.SUPABASE_URL)
    console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured',
        envVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
      }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      sampleCount: data?.length || 0
    })

  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Supabase connection failed',
      details: String(error)
    }, { status: 500 })
  }
}
