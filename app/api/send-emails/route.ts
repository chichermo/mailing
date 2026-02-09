import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { supabaseAdmin } from '@/lib/supabase'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

console.log('✅ SendGrid module loaded')

const formatSendGridError = (error: any) => {
  const body = error?.response?.body
  if (body?.errors?.length) {
    return body.errors.map((err: any) => err.message).join('; ')
  }
  if (typeof body === 'string') {
    return body
  }
  if (body) {
    try {
      return JSON.stringify(body)
    } catch {
      return 'Unable to serialize SendGrid error response'
    }
  }
  return error?.message || 'Unknown SendGrid error'
}

// POST - Send mass emails
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 === EMAIL SEND FUNCTION STARTED ===')
    console.log('🚀 Starting email send process with SendGrid...')
    console.log('🚀 Request method:', request.method)
    console.log('🚀 Request URL:', request.url)
    console.log('🚀 Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Check SendGrid configuration
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is required')
      return NextResponse.json(
        { success: false, error: 'SENDGRID_API_KEY is required' },
        { status: 400 }
      )
    }

    const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL
    const fromName = process.env.SENDGRID_FROM_NAME || process.env.FROM_NAME

    if (!fromEmail) {
      return NextResponse.json(
        { success: false, error: 'SENDGRID_FROM_EMAIL is required' },
        { status: 400 }
      )
    }

    const { templateId, listName, customSubject, customContent, testMode, ccEmails, bccEmails } = await request.json()
    console.log('📨 Request data:', { templateId, listName, customSubject, customContent, testMode, ccEmails, bccEmails })

    // Validate required fields
    if (!templateId && (!customSubject || !customContent)) {
      console.log('❌ Validation failed: Template or custom content required')
      return NextResponse.json(
        { success: false, error: 'Template or custom content is required' },
        { status: 400 }
      )
    }

    // Get template if specified
    let template = null
    if (templateId) {
      const { data, error } = await supabaseAdmin
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .maybeSingle()

      if (error) {
        throw error
      }

      template = data
      console.log('📝 Template found:', template ? 'YES' : 'NO')
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        )
      }
    }

    // Get contacts from the selected list
    let contacts: any[] = []
    if (listName === 'all') {
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('*')
      if (error) {
        throw error
      }
      contacts = data || []
    } else {
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .contains('list_names', [listName])
      if (error) {
        throw error
      }
      contacts = data || []
    }
    console.log('👥 Contacts found:', contacts.length)

    if (contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found in the specified list' },
        { status: 400 }
      )
    }

    // Limit the number of emails to prevent spam
    const maxEmails = testMode ? 5 : 350
    if (contacts.length > maxEmails) {
      return NextResponse.json(
        { success: false, error: `Maximum ${maxEmails} emails allowed per campaign` },
        { status: 400 }
      )
    }

    const subject = customSubject || template?.subject || 'New message from Heliopsis'
    const content = customContent || template?.content || ''

    console.log('📧 Email details:', { subject, contentLength: content.length })

    // Prepare emails - single BCC message
    const allRecipients = contacts.map((contact: any) => contact.email)
    
    // Create ONE email with all recipients in BCC
    const massEmail: any = {
      to: fromEmail,
      from: fromName ? { email: fromEmail, name: fromName } : fromEmail,
      replyTo: fromEmail,
      subject: subject,
      html: content,
      // Headers anti-spam
      headers: {
        'X-Mailer': 'Heliopsis Mailer',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    }

    // Add CC if specified
    if (ccEmails && ccEmails.length > 0) {
      massEmail.cc = ccEmails
    }

    // Add BCC with ALL recipients
    massEmail.bcc = allRecipients

    console.log('📨 Mass email prepared with:', {
      to: massEmail.to,
      bccCount: massEmail.bcc.length,
      subject: massEmail.subject,
      contentLength: massEmail.html.length
    })

    // Send SINGLE mass email
    try {
      console.log('📤 Sending MASS email to', allRecipients.length, 'recipients...')
      
      const sendResult = await sgMail.send(massEmail)
      console.log('✅ SendGrid response:', sendResult)
      
      console.log('🎉 Mass email sent successfully to all recipients!')
      
      // Save campaign data
      const campaignData = {
        template_id: templateId || null,
        template_name: template?.name || 'N/A',
        list_names: listName === 'all' ? ['all'] : [listName],
        custom_subject: customSubject || subject,
        custom_content: customContent || content,
        total_sent: allRecipients.length,
        success_count: allRecipients.length,
        error_count: 0,
        cc_recipients: ccEmails ? ccEmails.length : 0,
        bcc_recipients: allRecipients.length,
        created_at: new Date().toISOString(),
        status: 'sent',
        method: 'mass_email_bcc'
      }

      const { error: campaignError } = await supabaseAdmin
        .from('campaigns')
        .insert(campaignData)

      if (campaignError) {
        throw campaignError
      }

      return NextResponse.json({
        success: true,
        data: {
          totalSent: allRecipients.length,
          successCount: allRecipients.length,
          errorCount: 0,
          method: 'mass_email_bcc',
          message: `Mass email sent successfully to ${allRecipients.length} recipients via BCC`,
          campaign: campaignData
        }
      })

    } catch (error: any) {
      console.error('❌ Error sending mass email:', error)
      const statusCode = error?.response?.status || error?.code
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        statusCode,
        response: {
          body: error.response?.body || 'No response body',
          status: error.response?.status || 'No status',
          headers: error.response?.headers || 'No headers'
        }
      })
      
      const isAuthError = statusCode === 401 || statusCode === 403
      return NextResponse.json(
        {
          success: false,
          error: isAuthError
            ? 'SendGrid authorization failed. Check your API key, permissions, and sender verification.'
            : 'Error sending mass email',
          details: formatSendGridError(error)
        },
        { status: isAuthError ? statusCode : 500 }
      )
    }

  } catch (error: any) {
    console.error('💥 Fatal error in email sending:', error)
    console.error('💥 Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: 'Error sending emails', details: error.message },
      { status: 500 }
    )
  }
}
