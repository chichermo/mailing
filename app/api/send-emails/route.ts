import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { config } from '../../../lib/config'

const dbPath = path.join(process.cwd(), 'email_contacts.db')

// Configure SendGrid
sgMail.setApiKey(config.sendgrid.apiKey)
console.log('✅ SendGrid configured with API key from config')

// POST - Send mass emails
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting email send process...')
    console.log('🔍 Configuration check:', {
      SENDGRID_API_KEY: 'CONFIGURED',
      FROM_EMAIL: config.sendgrid.fromEmail,
      NODE_ENV: process.env.NODE_ENV
    })

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

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Get template if specified
    let template = null
    if (templateId) {
      template = await db.get('SELECT * FROM email_templates WHERE id = ?', [templateId])
      console.log('📝 Template found:', template ? 'YES' : 'NO')
      if (!template) {
        await db.close()
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        )
      }
    }

    // Get contacts from the specified list
    const contacts = await db.all(
      'SELECT * FROM contacts WHERE list_name = ? OR ? = "all"',
      [listName || 'General', listName]
    )
    console.log('👥 Contacts found:', contacts.length)

    if (contacts.length === 0) {
      await db.close()
      return NextResponse.json(
        { success: false, error: 'No contacts found in the specified list' },
        { status: 400 }
      )
    }

    // Limit the number of emails to prevent spam
    const maxEmails = testMode ? 5 : 200
    if (contacts.length > maxEmails) {
      await db.close()
      return NextResponse.json(
        { success: false, error: `Maximum ${maxEmails} emails allowed per campaign` },
        { status: 400 }
      )
    }

    const subject = customSubject || template?.subject || 'New message from Heliopsis'
    const content = customContent || template?.content || ''

    console.log('📧 Email details:', { subject, contentLength: content.length })

    // Prepare emails
    const emails = contacts.map(contact => {
      let personalizedContent = content
      let personalizedSubject = subject

      // Replace dynamic variables
      const variables = {
        '{{firstName}}': contact.first_name || '',
        '{{lastName}}': contact.last_name || '',
        '{{email}}': contact.email || '',
        '{{company}}': contact.company || '',
        '{{phone}}': contact.phone || '',
        '{{listName}}': contact.list_name || ''
      }

      Object.entries(variables).forEach(([key, value]) => {
        personalizedContent = personalizedContent.replace(new RegExp(key, 'g'), value)
        personalizedSubject = personalizedSubject.replace(new RegExp(key, 'g'), value)
      })

      return {
        to: contact.email,
        from: config.sendgrid.fromEmail,
        subject: personalizedSubject,
        html: personalizedContent,
        trackingSettings: {
          clickTracking: { enable: true, enableText: true },
          openTracking: { enable: true }
        }
      }
    })

    console.log('📨 Prepared emails:', emails.length)

    // Send emails
    const results = []
    let successCount = 0
    let errorCount = 0

    for (const email of emails) {
      try {
        console.log('📤 Sending email to:', email.to)
        console.log('📤 Email data:', { to: email.to, from: email.from, subject: email.subject })
        
        await sgMail.send(email)
        successCount++
        results.push({ email: email.to, status: 'success' })
        console.log('✅ Email sent successfully to:', email.to)
      } catch (error: any) {
        errorCount++
        console.error('❌ Error sending email to:', email.to, error)
        results.push({ email: email.to, status: 'error', error: error.message })
      }
    }

    console.log('📊 Send results:', { successCount, errorCount, total: emails.length })

    // Save sending history
    const campaignData = {
      name: `Campaign ${new Date().toLocaleDateString()}`,
      template_id: templateId,
      list_name: listName,
      subject: subject,
      total_sent: emails.length,
      success_count: successCount,
      error_count: errorCount,
      created_at: new Date().toISOString()
    }

    await db.run(
      'INSERT INTO email_campaigns (name, template_id, list_name, subject, total_sent, success_count, error_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [campaignData.name, campaignData.template_id, campaignData.list_name, campaignData.subject, campaignData.total_sent, campaignData.success_count, campaignData.error_count, campaignData.created_at]
    )

    await db.close()

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
