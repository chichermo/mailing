import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Detailed SendGrid debugging...')
    
    // Check configuration
    console.log('🔍 Configuration check:', {
      apiKey: process.env.SENDGRID_API_KEY ? 'SET' : 'MISSING',
      apiKeyLength: process.env.SENDGRID_API_KEY?.length || 0,
      apiKeyPreview: process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) + '...' : 'NOT SET',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'heliopsis@outlook.be',
      fromName: process.env.SENDGRID_FROM_NAME || 'Heliopsis Mail'
    })

    // Check API key format
    console.log('🔍 API Key format check:', {
      startsWithSG: process.env.SENDGRID_API_KEY?.startsWith('SG.') || false,
      hasValidLength: (process.env.SENDGRID_API_KEY?.length || 0) >= 60,
      containsSpecialChars: /[^a-zA-Z0-9._-]/.test(process.env.SENDGRID_API_KEY || ''),
      isValidFormat: /^SG\.[a-zA-Z0-9._-]+$/.test(process.env.SENDGRID_API_KEY || '')
    })

    // Set API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      console.log('✅ API key set')
    } else {
      console.log('❌ No API key found')
      return NextResponse.json({ error: 'No API key found' }, { status: 400 })
    }

    // Try to send a test email
    const testEmail = {
      to: 'guillermoromerog@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'heliopsis@outlook.be',
      subject: `SendGrid Debug Test - ${new Date().toISOString()}`,
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    }

    console.log('📤 Attempting to send minimal test email:', {
      to: testEmail.to,
      from: testEmail.from,
      subject: testEmail.subject
    })

    try {
      const result = await sgMail.send(testEmail)
      console.log('✅ Test email sent successfully!', result)
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
    console.error('💥 Fatal error in debug:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 })
  }
}
