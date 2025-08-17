import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Configure SendGrid
console.log('✅ SendGrid module loaded')

// POST - Send mass emails
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 === EMAIL SEND FUNCTION STARTED ===')
    console.log('🚀 Starting email send process with SendGrid...')
    console.log('🚀 Request method:', request.method)
    console.log('🚀 Request URL:', request.url)
    console.log('🚀 Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Check API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY is required')
      return NextResponse.json(
        { success: false, error: 'SENDGRID_API_KEY is required' },
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
      const templatesCollection = await getCollection('templates')
      template = await templatesCollection.findOne({ _id: new ObjectId(templateId) })
      console.log('📝 Template found:', template ? 'YES' : 'NO')
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        )
      }
    }

    // Obtener contactos de la lista especificada
    const contactsCollection = await getCollection('contacts')
    let contacts
    if (listName === 'all') {
      contacts = await contactsCollection.find({}).toArray()
    } else {
      contacts = await contactsCollection.find({ 
        listNames: { $in: [listName] } // Buscar en el array listNames
      }).toArray()
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

    // Prepare emails - CAMBIAR A ENVÍO MASIVO REAL
    const allRecipients = contacts.map((contact: any) => contact.email)
    
    // Crear UN SOLO email con todos los destinatarios en BCC
    const massEmail: any = {
      to: 'heliopsis@outlook.be', // Solo tú como destinatario principal
      from: 'heliopsis@outlook.be',
      replyTo: 'heliopsis@outlook.be',
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
      
      // Guardar datos de la campaña
      const campaignData = {
        templateId,
        templateName: template?.name || 'N/A',
        listNames: listName === 'all' ? ['all'] : [listName],
        customSubject: customSubject || '',
        customContent: customContent || '',
        total_sent: allRecipients.length,
        success_count: allRecipients.length, // Todos exitosos en envío masivo
        error_count: 0,
        cc_recipients: ccEmails ? ccEmails.length : 0,
        bcc_recipients: allRecipients.length,
        created_at: new Date(),
        status: 'sent',
        method: 'mass_email_bcc' // Indicar que fue envío masivo
      }

      const campaignsCollection = await getCollection('campaigns')
      await campaignsCollection.insertOne(campaignData)

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
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        statusCode: error.code,
        response: {
          body: error.response?.body || 'No response body',
          status: error.response?.status || 'No status',
          headers: error.response?.headers || 'No headers'
        }
      })
      
      return NextResponse.json(
        { success: false, error: 'Error sending mass email', details: error.message },
        { status: 500 }
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
