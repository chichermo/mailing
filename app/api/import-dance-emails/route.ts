import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const folderPath = path.join(process.cwd(), 'data', 'dance-emails')
    
    // Connect to database
    const contactsCollection = await getCollection('contacts')

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
          .map(line => {
            // Split by tab character and get the email part
            const parts = line.split('\t')
            if (parts.length >= 2) {
              // Get the email part (usually the second part)
              const emailPart = parts[1].trim()
              // Extract just the email address, removing any additional info in parentheses
              const emailMatch = emailPart.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
              return emailMatch ? emailMatch[0].toLowerCase() : null
            }
            return null
          })
          .filter(email => email) // Remove null values

        console.log(`📧 Processing ${file}: ${emails.length} emails for list "${listName}"`)

        // Import each email
        for (const email of emails) {
          try {
            // Check if contact already exists
            const existingContact = await contactsCollection.findOne({ email })
            
            if (existingContact) {
              // Update existing contact with new list
              if (!existingContact.listNames.includes(listName)) {
                // Extract name from the line for potential update
                const lineParts = line.split('\t')
                let firstName = existingContact.firstName
                let lastName = existingContact.lastName
                
                if (lineParts.length >= 1) {
                  const namePart = lineParts[0].trim()
                  const cleanName = namePart.replace(/\s*\([^)]*\)/g, '').trim()
                  const nameParts = cleanName.split(' ')
                  
                  if (nameParts.length >= 2) {
                    firstName = nameParts[0]
                    lastName = nameParts.slice(1).join(' ')
                  } else if (nameParts.length === 1) {
                    firstName = nameParts[0]
                  }
                }
                
                await contactsCollection.updateOne(
                  { email },
                  { 
                    $addToSet: { listNames: listName },
                    $set: { 
                      firstName,
                      lastName,
                      updatedAt: new Date()
                    }
                  }
                )
                console.log(`✅ Updated contact ${email} with list ${listName} and name ${firstName} ${lastName}`)
              }
            } else {
              // Extract name from the line
              const lineParts = line.split('\t')
              let firstName = 'Imported'
              let lastName = 'Contact'
              
              if (lineParts.length >= 1) {
                const namePart = lineParts[0].trim()
                // Remove any additional info in parentheses
                const cleanName = namePart.replace(/\s*\([^)]*\)/g, '').trim()
                const nameParts = cleanName.split(' ')
                
                if (nameParts.length >= 2) {
                  firstName = nameParts[0]
                  lastName = nameParts.slice(1).join(' ')
                } else if (nameParts.length === 1) {
                  firstName = nameParts[0]
                }
              }
              
              // Create new contact
              const newContact = {
                firstName,
                lastName,
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