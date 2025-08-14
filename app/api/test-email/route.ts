import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  try {
    console.log('🧪 Testing email sending...')
    
    // Check environment variables
    console.log('📊 Environment check:')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
    console.log('- RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0)
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not found'
      }, { status: 500 })
    }

    // Test email sending
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      console.log('🔍 Attempting to send test email...')
      
      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'guillermoromerog@gmail.com',
        subject: 'Test Email - ' + new Date().toISOString(),
        html: '<p>This is a test email to verify Resend is working.</p>'
      })
      
      console.log('✅ Email sent successfully:', result)
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        result: result
      })
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      return NextResponse.json({
        success: false,
        error: 'Email sending failed',
        details: String(emailError)
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
