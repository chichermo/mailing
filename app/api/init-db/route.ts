import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/init-db'

export async function GET() {
  try {
    console.log('🔄 Initializing database via API route...')
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('- MONGODB_URI length:', process.env.MONGODB_URI?.length || 0)
    
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
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
