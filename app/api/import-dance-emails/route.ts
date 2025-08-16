import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const folderPath = "C:\\Users\\guill\\OneDrive\\Escritorio\\Heliopsismail\\OneDrive_2025-08-16\\email adressen"
    
    // Connect to database
    const { db } = await connectToDatabase()
    const contactsCollection = db.collection('contacts')

    // Read all .txt files from the folder
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.txt'))
    
    let totalImported = 0
    let totalErrors = 0
    const results = []

    for (const file of files) {
      try {
        const filePath = path.join(folderPath, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        
        // Extract list name from filename
        const listName = file
          .replace('Dansgroep Heliopsis vzw - ', '')
          .replace(' - Werkjaar 2024-2025.txt', '')
          .replace('.txt', '')
        
        // Parse emails from file content
        const emails = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.includes('@'))
          .map(email => email.toLowerCase())

        console.log(`📧 Processing ${file}: ${emails.length} emails for list "${listName}"`)

        // Import each email
        for (const email of emails) {
          try {
            // Check if contact already exists
            const existingContact = await contactsCollection.findOne({ email })
            
            if (existingContact) {
              // Update existing contact with new list
              if (!existingContact.listNames.includes(listName)) {
                await contactsCollection.updateOne(
                  { email },
                  { $addToSet: { listNames: listName } }
                )
                console.log(`✅ Updated contact ${email} with list ${listName}`)
              }
            } else {
              // Create new contact
              const newContact = {
                firstName: 'Imported',
                lastName: 'Contact',
                email,
                company: '',
                phone: '',
                listNames: [listName],
                createdAt: new Date(),
                source: `Imported from ${file}`,
                importedAt: new Date()
              }
              
              await contactsCollection.insertOne(newContact)
              totalImported++
              console.log(`✅ Created new contact ${email} for list ${listName}`)
            }
          } catch (emailError) {
            totalErrors++
            results.push({ email, error: emailError.message })
            console.error(`❌ Error with email ${email}:`, emailError.message)
          }
        }
        
        results.push({ file, listName, emailsImported: emails.length })
        
      } catch (fileError) {
        totalErrors++
        results.push({ file, error: fileError.message })
        console.error(`❌ Error processing file ${file}:`, fileError.message)
      }
    }

    // Get final count
    const finalCount = await contactsCollection.countDocuments()

    return NextResponse.json({
      success: true,
      message: `Import completed: ${totalImported} new contacts imported, ${totalErrors} errors`,
      summary: {
        totalFiles: files.length,
        totalImported,
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