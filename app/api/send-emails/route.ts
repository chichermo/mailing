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

/** Convierte imágenes base64 en HTML a adjuntos CID para que los clientes de email las muestren inline */
function convertBase64ImagesToAttachments(html: string): { html: string; attachments: Array<{ content: string; filename: string; type: string; contentId: string; disposition: string }> } {
  const attachments: Array<{ content: string; filename: string; type: string; contentId: string; disposition: string }> = []
  const dataUrlRegex = /src=["'](data:image\/(jpeg|jpg|png|gif|webp);base64,([^"']+))["']/gi
  let match
  let index = 0
  let result = html

  while ((match = dataUrlRegex.exec(html)) !== null) {
    const fullDataUrl = match[1]
    const subtype = match[2].toLowerCase()
    const base64Content = match[3].replace(/\s/g, '')
    const mimeMap: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp'
    }
    const type = mimeMap[subtype] || 'image/png'
    const ext = subtype === 'jpg' ? 'jpeg' : subtype
    const contentId = `img_${index}_${Date.now()}`
    attachments.push({
      content: base64Content,
      filename: `image.${ext}`,
      type,
      contentId,
      disposition: 'inline'
    })
    result = result.replace(fullDataUrl, `cid:${contentId}`)
    index++
  }

  return { html: result, attachments }
}

// POST - Send emails
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

    let body: any
    try {
      body = await request.json()
    } catch (parseError: any) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body', details: parseError?.message },
        { status: 400 }
      )
    }
    const { templateId, listName, customSubject, customContent, testMode, ccEmails, bccEmails } = body
    console.log('📨 Request data:', { templateId, listName, customSubject: customSubject ? '[set]' : null, customContent: customContent ? `[${customContent.length} chars]` : null, testMode, ccEmails, bccEmails })

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
    let content = (typeof customContent === 'string' ? customContent : template?.content) || ''

    // Convert base64 images to CID attachments so recipients can see logos/signatures
    const { html: contentWithCid, attachments: cidAttachments } = convertBase64ImagesToAttachments(String(content))
    content = contentWithCid
    if (cidAttachments.length > 0) {
      console.log('📷 Converted', cidAttachments.length, 'base64 image(s) to inline attachments')
    }

    console.log('📧 Email details:', { subject, contentLength: content.length })

    const replaceVariables = (text: string, contact: any) => {
      const rawFirst = contact.first_name || contact.firstName || ''
      const rawLast = contact.last_name || contact.lastName || ''
      const map: Record<string, string> = {
        // Use swapped names to match existing imports without re-importing
        firstName: rawLast || rawFirst,
        lastName: rawFirst || rawLast,
        email: contact.email || '',
        company: contact.company || '',
        phone: contact.phone || '',
        listName:
          listName === 'all'
            ? (contact.list_names?.[0] || contact.listNames?.[0] || 'all')
            : listName
      }

      let output = text
      Object.keys(map).forEach((key) => {
        const value = map[key] || ''
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}|\\{\\s*${key}\\s*\\}`, 'gi')
        output = output.replace(regex, value)
      })
      return output
    }

    const baseMessage = {
      from: fromName ? { email: fromEmail, name: fromName } : fromEmail,
      replyTo: fromEmail,
      headers: {
        'X-Mailer': 'Heliopsis Mailer',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    }

    let successCount = 0
    let errorCount = 0
    let lastError: any = null

    console.log('📤 Sending individual emails to', contacts.length, 'recipients...')

    for (const contact of contacts) {
      const personalizedSubject = replaceVariables(subject, contact)
      const personalizedContent = replaceVariables(content, contact)
      const message: any = {
        ...baseMessage,
        to: contact.email,
        subject: personalizedSubject,
        html: personalizedContent
      }

      if (cidAttachments.length > 0) {
        message.attachments = cidAttachments
      }
      if (ccEmails && ccEmails.length > 0) {
        message.cc = ccEmails
      }
      if (bccEmails && bccEmails.length > 0) {
        message.bcc = bccEmails
      }

      try {
        await sgMail.send(message)
        successCount += 1
      } catch (error: any) {
        errorCount += 1
        lastError = error
        console.error('❌ Error sending to contact:', contact.email, error?.message || error)
      }
    }

    const campaignData = {
      template_id: templateId || null,
      template_name: template?.name || 'N/A',
      list_names: listName === 'all' ? ['all'] : [listName],
      custom_subject: customSubject || subject,
      custom_content: customContent || content,
      total_sent: contacts.length,
      success_count: successCount,
      error_count: errorCount,
      cc_recipients: ccEmails ? ccEmails.length : 0,
      bcc_recipients: bccEmails ? bccEmails.length : 0,
      created_at: new Date().toISOString(),
      status: errorCount === 0 ? 'sent' : successCount === 0 ? 'failed' : 'partial',
      method: 'individual_emails'
    }

    const { error: campaignError } = await supabaseAdmin
      .from('campaigns')
      .insert(campaignData)

    if (campaignError) {
      console.warn('⚠️ Campaign log not saved (non-fatal):', campaignError.message)
    }

    if (successCount === 0 && lastError) {
      const statusCode = lastError?.response?.status || lastError?.code
      const isAuthError = statusCode === 401 || statusCode === 403
      return NextResponse.json(
        {
          success: false,
          error: isAuthError
            ? 'SendGrid authorization failed. Check your API key, permissions, and sender verification.'
            : 'Error sending emails',
          details: formatSendGridError(lastError)
        },
        { status: isAuthError ? statusCode : 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSent: contacts.length,
        successCount,
        errorCount,
        method: 'individual_emails',
        message: `Sent ${successCount} of ${contacts.length} emails successfully`,
        campaign: campaignData
      }
    })

  } catch (error: any) {
    console.error('💥 Fatal error in email sending:', error)
    console.error('💥 Error stack:', error.stack)
    const details = error?.response?.body?.errors?.[0]?.message || error?.message || String(error)
    return NextResponse.json(
      { success: false, error: 'Error sending emails', details },
      { status: 500 }
    )
  }
}
