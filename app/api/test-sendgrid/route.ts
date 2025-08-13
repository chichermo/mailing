import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { config } from '../../../lib/config'

export async function GET() {
  try {
    console.log('🧪 Testing SendGrid configuration...')
    
    // Test 1: Check configuration
    console.log('🔍 Configuration check:', {
      apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
      apiKeyLength: config.sendgrid.apiKey?.length || 0,
      fromEmail: config.sendgrid.fromEmail,
      fromName: config.sendgrid.fromName
    })

    // Test 2: Set API key
    sgMail.setApiKey(config.sendgrid.apiKey)
    console.log('✅ API key set')

    // Test 3: Try to send a test email
    const testEmail = {
      to: 'guillermoromerog@gmail.com',
      from: config.sendgrid.fromEmail,
      subject: 'SendGrid Test - ' + new Date().toISOString(),
      html: '<h1>Test Email</h1><p>This is a test email to verify SendGrid configuration.</p>'
    }

    console.log('📤 Attempting to send test email:', {
      to: testEmail.to,
      from: testEmail.from,
      subject: testEmail.subject
    })

    try {
      await sgMail.send(testEmail)
      console.log('✅ Test email sent successfully!')
      
      return NextResponse.json({
        success: true,
        message: 'SendGrid test successful - email sent!',
        config: {
          apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
          apiKeyLength: config.sendgrid.apiKey?.length || 0,
          fromEmail: config.sendgrid.fromEmail,
          fromName: config.sendgrid.fromName
        }
      })
    } catch (sendError: any) {
      console.error('❌ SendGrid send error:', sendError)
      
      return NextResponse.json({
        success: false,
        message: 'SendGrid send failed',
        error: {
          message: sendError.message,
          code: sendError.code,
          response: sendError.response?.body || 'No response body'
        },
        config: {
          apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
          apiKeyLength: config.sendgrid.apiKey?.length || 0,
          fromEmail: config.sendgrid.fromEmail,
          fromName: config.sendgrid.fromName
        }
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('💥 Fatal error in SendGrid test:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Fatal error in SendGrid test',
      error: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 })
  }
}
