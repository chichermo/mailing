import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Testing environment variables...')
    
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE: {
        SUPABASE_URL: {
          exists: !!process.env.SUPABASE_URL,
          length: process.env.SUPABASE_URL?.length || 0,
          preview: process.env.SUPABASE_URL?.substring(0, 40) + '...',
          full: process.env.SUPABASE_URL
        },
        SUPABASE_SERVICE_ROLE_KEY: {
          exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
          preview: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...'
            : 'NOT SET',
          full: process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      },
      SENDGRID: {
        SENDGRID_API_KEY: {
          exists: !!process.env.SENDGRID_API_KEY,
          length: process.env.SENDGRID_API_KEY?.length || 0,
          preview: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) + '...' : 'NOT SET',
          full: process.env.SENDGRID_API_KEY
        },
        SENDGRID_FROM_EMAIL: {
          exists: !!process.env.SENDGRID_FROM_EMAIL,
          value: process.env.SENDGRID_FROM_EMAIL || 'NOT SET'
        },
        SENDGRID_FROM_NAME: {
          exists: !!process.env.SENDGRID_FROM_NAME,
          value: process.env.SENDGRID_FROM_NAME || 'NOT SET'
        },
        FROM_EMAIL: {
          exists: !!process.env.FROM_EMAIL,
          value: process.env.FROM_EMAIL || 'NOT SET'
        },
        FROM_NAME: {
          exists: !!process.env.FROM_NAME,
          value: process.env.FROM_NAME || 'NOT SET'
        }
      },
      allSupabaseVars: Object.keys(process.env).filter(key => key.includes('SUPABASE')),
      allSendGridVars: Object.keys(process.env).filter(key => key.includes('SENDGRID')),
      allEmailVars: Object.keys(process.env).filter(key => key.includes('EMAIL') || key.includes('FROM')),
      allEnvVars: Object.keys(process.env).sort()
    }
    
    console.log('📊 Environment variables:', envVars)
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables test',
      data: envVars
    })
  } catch (error) {
    console.error('❌ Error testing environment variables:', error)
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
