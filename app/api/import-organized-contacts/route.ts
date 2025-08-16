import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'dance-emails', 'contactos_organizados.txt')
    
    // Connect to database
    const contactsCollection = await getCollection('contacts')

    // Read the organized contacts file
    const content = fs.readFileSync(filePath, 'utf-8')
    
    let totalImported = 0
    let totalErrors = 0
    let totalSkipped = 0
    const results = []
    const processedEmails = new Set()

    // Parse lines and extract contacts
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.startsWith('•'))

    console.log(`📧 Processing organized contacts file: ${lines.length} contact lines found`)

    for (const line of lines) {
      try {
        // Parse format: "• Nombre - email@dominio.com"
        const match = line.match(/^•\s*(.+?)\s*-\s*(.+)$/)
        if (!match) {
          totalSkipped++
          console.log(`   ⚠️  Skipping line (invalid format): "${line}"`)
          continue
        }

        const name = match[1].trim()
        const email = match[2].trim().toLowerCase()

        // Validate email
        const emailMatch = email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
        if (!emailMatch) {
          totalSkipped++
          console.log(`   ⚠️  Skipping line (invalid email): "${line}"`)
          continue
        }

        const cleanEmail = emailMatch[0].toLowerCase()

        // Skip if we already processed this email
        if (processedEmails.has(cleanEmail)) {
          totalSkipped++
          console.log(`   ⚠️  Skipping duplicate email: ${cleanEmail}`)
          continue
        }

        // Extract name parts
        let firstName = 'Imported'
        let lastName = 'Contact'
        
        if (name) {
          const cleanName = name.replace(/\s*\([^)]*\)/g, '').trim()
          const nameParts = cleanName.split(' ')
          
          if (nameParts.length >= 2) {
            firstName = nameParts[0]
            lastName = nameParts.slice(1).join(' ')
          } else if (nameParts.length === 1) {
            firstName = nameParts[0]
          }
        }

        // Check if contact already exists
        const existingContact = await contactsCollection.findOne({ email: cleanEmail })
        
        if (existingContact) {
          console.log(`   ℹ️  Contact already exists: ${cleanEmail}`)
        } else {
          // Create new contact
          const newContact = {
            firstName,
            lastName,
            email: cleanEmail,
            company: '',
            phone: '',
            listNames: ['Organized Import'],
            createdAt: new Date(),
            source: 'Imported from contactos_organizados.txt',
            importedAt: new Date()
          }
          
          await contactsCollection.insertOne(newContact)
          totalImported++
          processedEmails.add(cleanEmail)
          console.log(`✅ Created new contact ${cleanEmail} with name ${firstName} ${lastName}`)
        }

      } catch (error) {
        totalErrors++
        console.error(`❌ Error processing line: ${line}`, error.message)
        results.push({ line, error: error.message })
      }
    }

    // Get final count
    const finalCount = await contactsCollection.countDocuments()

    console.log(`\n🎯 IMPORT SUMMARY:`)
    console.log(`   - Total lines processed: ${lines.length}`)
    console.log(`   - New contacts imported: ${totalImported}`)
    console.log(`   - Lines skipped: ${totalSkipped}`)
    console.log(`   - Errors: ${totalErrors}`)
    console.log(`   - Final total contacts: ${finalCount}`)

    return NextResponse.json({
      success: true,
      message: `Import completed: ${totalImported} new contacts imported, ${totalErrors} errors, ${totalSkipped} skipped`,
      summary: {
        totalLines: lines.length,
        totalImported,
        totalSkipped,
        totalErrors,
        finalTotalContacts: finalCount
      },
      results
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
