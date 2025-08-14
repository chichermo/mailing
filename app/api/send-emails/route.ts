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

    const { templateId, listName, customSubject, customContent, testMode } = await request.json()
    console.log('📨 Request data:', { templateId, listName, customSubject, customContent, testMode })

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

    // Get contacts from the specified list
    const contactsCollection = await getCollection('contacts')
    const contacts = await contactsCollection.find({
      $or: [
        { listName: listName || 'General' },
        { listName: 'all' }
      ]
    }).toArray()
    console.log('👥 Contacts found:', contacts.length)

    if (contacts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No contacts found in the specified list' },
        { status: 400 }
      )
    }

    // Limit the number of emails to prevent spam
    const maxEmails = testMode ? 5 : 200
    if (contacts.length > maxEmails) {
      return NextResponse.json(
        { success: false, error: `Maximum ${maxEmails} emails allowed per campaign` },
        { status: 400 }
      )
    }

    const subject = customSubject || template?.subject || 'New message from Heliopsis'
    const content = customContent || template?.content || ''

    console.log('📧 Email details:', { subject, contentLength: content.length })

    // Prepare emails
    const emails = contacts.map((contact: any) => {
      let personalizedContent = content
      let personalizedSubject = subject

      // Replace dynamic variables
      const variables = {
        '{{firstName}}': contact.firstName || '',
        '{{lastName}}': contact.lastName || '',
        '{{email}}': contact.email || '',
        '{{company}}': contact.company || '',
        '{{phone}}': contact.phone || '',
        '{{listName}}': contact.listName || ''
      }

      Object.entries(variables).forEach(([key, value]) => {
        personalizedContent = personalizedContent.replace(new RegExp(key, 'g'), value)
        personalizedSubject = personalizedSubject.replace(new RegExp(key, 'g'), value)
      })

      return {
        to: contact.email,
        from: 'heliopsis@outlook.be',
        subject: personalizedSubject,
        html: personalizedContent
      }
    })

    console.log('📨 Prepared emails:', emails.length)

    // 🔍 DEBUG: Show first email structure
    if (emails.length > 0) {
      console.log('🔍 First email structure:', {
        to: emails[0].to,
        from: emails[0].from,
        subject: emails[0].subject,
        hasHtml: !!emails[0].html,
        htmlLength: emails[0].html?.length || 0
      })
    }

    // Send emails
    const results = []
    let successCount = 0
    let errorCount = 0

    for (const email of emails) {
      try {
        console.log('📤 Sending email to:', email.to)
        console.log('📤 Email data:', { to: email.to, from: email.from, subject: email.subject })
        
        // 🔍 DEBUG: Show exact email object being sent
        console.log('🔍 Exact email object for SendGrid:', JSON.stringify(email, null, 2))
        
        const sendResult = await sgMail.send(email)
        console.log('✅ SendGrid response:', sendResult)
        
        successCount++
        results.push({ email: email.to, status: 'success' })
        console.log('✅ Email sent successfully to:', email.to)
      } catch (error: any) {
        errorCount++
        console.error('❌ Error sending email to:', email.to)
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
        console.error('❌ Full error object:', error)
        results.push({ email: email.to, status: 'error', error: error.message })
      }
    }

    console.log('📊 Send results:', { successCount, errorCount, total: emails.length })

    // Save sending history
    const campaignData = {
      name: `Campaign ${new Date().toLocaleDateString()}`,
      template_id: templateId,
      listName: listName,
      subject: subject,
      total_sent: emails.length,
      success_count: successCount,
      error_count: errorCount,
      status: 'sent',
      created_at: new Date()
    }

    const campaignsCollection = await getCollection('campaigns')
    await campaignsCollection.insertOne(campaignData)

    console.log('🎉 Campaign completed successfully')

    return NextResponse.json({
      success: true,
      data: {
        totalSent: emails.length,
        successCount,
        errorCount,
        results,
        campaign: campaignData
      }
    })

  } catch (error: any) {
    console.error('💥 Fatal error in email sending:', error)
    console.error('💥 Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: 'Error sending emails', details: error.message },
      { status: 500 }
    )
  }
}
