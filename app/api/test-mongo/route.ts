import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...')
    
    // Check environment variables
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('- MONGODB_URI length:', process.env.MONGODB_URI?.length || 0)
    
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        error: 'MONGODB_URI not found',
        envVars: Object.keys(process.env).filter(key => key.includes('MONGODB'))
      }, { status: 500 })
    }

    // Test MongoDB connection
    try {
      const { MongoClient } = await import('mongodb')
      console.log('🔍 Attempting to connect to MongoDB...')
      
      const client = new MongoClient(process.env.MONGODB_URI)
      await client.connect()
      console.log('✅ MongoDB connection successful')
      
      // Test database access
      const db = client.db()
      const collections = await db.listCollections().toArray()
      console.log('📋 Collections found:', collections.length)
      
      await client.close()
      
      return NextResponse.json({
        success: true,
        message: 'MongoDB connection successful',
        collections: collections.length,
        uri: process.env.MONGODB_URI.substring(0, 50) + '...'
      })
      
    } catch (mongoError) {
      console.error('❌ MongoDB connection failed:', mongoError)
      return NextResponse.json({
        success: false,
        error: 'MongoDB connection failed',
        details: String(mongoError),
        uri: process.env.MONGODB_URI.substring(0, 100) + '...'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: String(error)
    }, { status: 500 })
  }
}
