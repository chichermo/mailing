import { NextRequest, NextResponse } from 'next/server'
import { testTwilioConnection } from '@/lib/services-config'

export async function GET() {
  try {
    console.log('🧪 Testing Twilio connection...')
    
    const result = await testTwilioConnection()
    
    if (result.success) {
      console.log('✅ Twilio test successful')
    } else {
      console.log('❌ Twilio test failed:', result.message)
    }
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      details: result.details
    })
  } catch (error: any) {
    console.error('❌ Error testing Twilio:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test Twilio',
      details: error.message
    }, { status: 500 })
  }
}
