import { NextRequest, NextResponse } from 'next/server'
import { testResendEmail } from '@/lib/services-config'

export async function POST(request: NextRequest) {
  try {
    const { toEmail } = await request.json()
    
    if (!toEmail) {
      return NextResponse.json({
        success: false,
        error: 'toEmail is required'
      }, { status: 400 })
    }
    
    console.log('🧪 Testing Resend with email:', toEmail)
    
    const result = await testResendEmail(toEmail)
    
    if (result.success) {
      console.log('✅ Resend test successful')
    } else {
      console.log('❌ Resend test failed:', result.message)
    }
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      details: result.details
    })
  } catch (error: any) {
    console.error('❌ Error testing Resend:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test Resend',
      details: error.message
    }, { status: 500 })
  }
}
