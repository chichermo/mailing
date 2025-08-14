import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/init-db'

export async function GET() {
  try {
    console.log('🔄 Initializing database via API route...')
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('- MONGODB_URI length:', process.env.MONGODB_URI?.length || 0)
    console.log('- MONGODB_URI preview:', process.env.MONGODB_URI?.substring(0, 50) + '...')
    console.log('- All env vars:', Object.keys(process.env).filter(key => key.includes('MONGODB')))
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set!')
      return NextResponse.json(
        { 
          success: false, 
          error: 'MONGODB_URI environment variable is not configured',
          envCheck: {
            NODE_ENV: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI,
            envVars: Object.keys(process.env).filter(key => key.includes('MONGODB'))
          }
        },
        { status: 500 }
      )
    }

    // Test MongoDB connection first
    try {
      console.log('🔍 Testing MongoDB connection...')
      const { MongoClient } = await import('mongodb')
      const client = new MongoClient(process.env.MONGODB_URI)
      await client.connect()
      console.log('✅ MongoDB connection successful')
      await client.close()
    } catch (mongoError) {
      console.error('❌ MongoDB connection failed:', mongoError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'MongoDB connection failed',
          mongoError: String(mongoError),
          uri: process.env.MONGODB_URI?.substring(0, 100) + '...'
        },
        { status: 500 }
      )
    }
    
    const success = await initializeDatabase()
    
    if (success) {
      console.log('✅ Database initialized successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Database initialized successfully' 
      })
    } else {
      console.error('❌ Failed to initialize database')
      return NextResponse.json(
        { success: false, error: 'Failed to initialize database' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error)
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
