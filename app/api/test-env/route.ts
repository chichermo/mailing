import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Testing environment variables...')
    
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: {
        exists: !!process.env.MONGODB_URI,
        length: process.env.MONGODB_URI?.length || 0,
        preview: process.env.MONGODB_URI?.substring(0, 50) + '...',
        full: process.env.MONGODB_URI
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
      allMongoVars: Object.keys(process.env).filter(key => key.includes('MONGODB')),
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
