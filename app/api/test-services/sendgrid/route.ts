import { NextRequest, NextResponse } from 'next/server'
import { testSendGridEmail } from '@/lib/services-config'

export async function POST(request: NextRequest) {
  try {
    const { toEmail } = await request.json()
    
    if (!toEmail) {
      return NextResponse.json({
        success: false,
        error: 'toEmail is required'
      }, { status: 400 })
    }
    
    console.log('🧪 Testing SendGrid with email:', toEmail)
    
    const result = await testSendGridEmail(toEmail)
    
    if (result.success) {
      console.log('✅ SendGrid test successful')
    } else {
      console.log('❌ SendGrid test failed:', result.message)
    }
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      details: result.details
    })
  } catch (error: any) {
    console.error('❌ Error testing SendGrid:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test SendGrid',
      details: error.message
    }, { status: 500 })
  }
}
