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
      allMongoVars: Object.keys(process.env).filter(key => key.includes('MONGODB')),
      allEnvVars: Object.keys(process.env).slice(0, 20) // Primeras 20 variables
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
