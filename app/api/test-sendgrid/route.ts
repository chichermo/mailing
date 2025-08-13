import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Resend configuration...')
    
    // Check configuration
    console.log('🔍 Configuration check:', {
      apiKey: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',
      apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
      apiKeyPreview: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET',
      fromEmail: 'onboarding@resend.dev',
      fromName: 'Heliopsis Mail'
    })

    // Set API key
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      console.log('✅ API key set')
    } else {
      console.log('❌ No API key found')
      return NextResponse.json({ error: 'No API key found' }, { status: 400 })
    }

    // Try to send a test email
    const resend = new Resend(process.env.RESEND_API_KEY)
    const testEmail = {
      to: 'guillermoromerog@gmail.com',
      from: 'onboarding@resend.dev',
      subject: `Resend Test - ${new Date().toISOString()}`,
      html: '<p>This is a test email to verify Resend configuration.</p>'
    }

    console.log('📤 Attempting to send test email:', {
      to: testEmail.to,
      from: testEmail.from,
      subject: testEmail.subject
    })

    try {
      const result = await resend.emails.send(testEmail)
      console.log('✅ Test email sent successfully!')
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        result: result
      })
    } catch (sendError: any) {
      console.error('❌ Error sending test email:', sendError)
      return NextResponse.json({ 
        error: 'Failed to send test email', 
        details: sendError.message 
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('💥 Fatal error in test:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 })
  }
}
