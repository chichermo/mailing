import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { config } from '../../../lib/config'

export async function GET() {
  try {
    console.log('🔍 Detailed SendGrid debugging...')
    
    // Test 1: Check configuration
    const configCheck = {
      apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
      apiKeyLength: config.sendgrid.apiKey?.length || 0,
      apiKeyPreview: config.sendgrid.apiKey ? config.sendgrid.apiKey.substring(0, 10) + '...' : 'NOT SET',
      fromEmail: config.sendgrid.fromEmail,
      fromName: config.sendgrid.fromName
    }
    
    console.log('🔍 Configuration check:', configCheck)

    // Test 2: Check API key format
    const apiKeyFormat = {
      startsWithSG: config.sendgrid.apiKey?.startsWith('SG.') || false,
      hasValidLength: (config.sendgrid.apiKey?.length || 0) >= 60,
      containsSpecialChars: /[^a-zA-Z0-9._-]/.test(config.sendgrid.apiKey || ''),
      isValidFormat: /^SG\.[a-zA-Z0-9._-]+$/.test(config.sendgrid.apiKey || '')
    }
    
    console.log('🔍 API Key format check:', apiKeyFormat)

    // Test 3: Set API key
    try {
      sgMail.setApiKey(config.sendgrid.apiKey)
      console.log('✅ API key set successfully')
    } catch (setKeyError: any) {
      console.error('❌ Error setting API key:', setKeyError)
      return NextResponse.json({
        success: false,
        message: 'Failed to set API key',
        error: setKeyError.message,
        config: configCheck,
        apiKeyFormat
      }, { status: 500 })
    }

    // Test 4: Try to send a minimal test email
    const testEmail = {
      to: 'guillermoromerog@gmail.com',
      from: config.sendgrid.fromEmail,
      subject: 'SendGrid Debug Test - ' + new Date().toISOString(),
      text: 'This is a minimal test email to debug SendGrid issues.'
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
        message: 'SendGrid debug successful - email sent!',
        config: configCheck,
        apiKeyFormat,
        result
      })
    } catch (sendError: any) {
      console.error('❌ SendGrid send error:', sendError)
      
      // Extract detailed error information
      const errorDetails = {
        message: sendError.message,
        code: sendError.code,
        statusCode: sendError.code,
        response: {
          body: sendError.response?.body || 'No response body',
          status: sendError.response?.status || 'No status',
          headers: sendError.response?.headers || 'No headers'
        }
      }
      
      console.log('🔍 Detailed error info:', errorDetails)
      
      return NextResponse.json({
        success: false,
        message: 'SendGrid send failed',
        error: errorDetails,
        config: configCheck,
        apiKeyFormat
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('💥 Fatal error in SendGrid debug:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Fatal error in SendGrid debug',
      error: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 })
  }
}
