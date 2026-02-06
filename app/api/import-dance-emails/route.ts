import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const folderPath = path.join(process.cwd(), 'data', 'dance-emails')
    
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
        
        // Parse lines and extract emails with names
        const lines = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.includes('@'))

        console.log(`📧 Processing ${file}: ${lines.length} lines for list "${listName}"`)

        let emailsImported = 0
        let linesProcessed = 0
        let linesSkipped = 0

        // Import each line
        for (const line of lines) {
          try {
            // Split by tab character and get the parts
            const parts = line.split('\t')
            if (parts.length < 2) {
              linesSkipped++
              console.log(`   ⚠️  Skipping line (${parts.length} parts): "${line}"`)
              continue
            }
            
            // Get the email part (second part)
            const emailPart = parts[1].trim()
            // Extract just the email address, removing any additional info in parentheses
            const emailMatch = emailPart.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
            if (!emailMatch) {
              linesSkipped++
              console.log(`   ⚠️  Skipping line (invalid email): "${line}"`)
              continue
            }
            
            const email = emailMatch[0].toLowerCase()
            
            // Check if contact already exists
            const { data: existingContact, error: existingError } = await supabaseAdmin
              .from('contacts')
              .select('id,first_name,last_name,list_names')
              .eq('email', email)
              .maybeSingle()

            if (existingError) {
              throw existingError
            }
            
            if (existingContact) {
              // Update existing contact with new list
              const currentLists: string[] = Array.isArray(existingContact.list_names) ? existingContact.list_names : []
              if (!currentLists.includes(listName)) {
                // Extract name from the line for potential update
                let firstName = existingContact.first_name
                let lastName = existingContact.last_name
                
                if (parts.length >= 1) {
                  const namePart = parts[0].trim()
                  const cleanName = namePart.replace(/\s*\([^)]*\)/g, '').trim()
                  const nameParts = cleanName.split(' ')
                  
                  if (nameParts.length >= 2) {
                    firstName = nameParts[0]
                    lastName = nameParts.slice(1).join(' ')
                  } else if (nameParts.length === 1) {
                    firstName = nameParts[0]
                  }
                }
                
                const { error: updateError } = await supabaseAdmin
                  .from('contacts')
                  .update({ 
                    list_names: [...currentLists, listName],
                    first_name: firstName,
                    last_name: lastName
                  })
                  .eq('email', email)

                if (updateError) {
                  throw updateError
                }
                console.log(`✅ Updated contact ${email} with list ${listName} and name ${firstName} ${lastName}`)
              }
            } else {
              // Extract name from the line
              let firstName = 'Imported'
              let lastName = 'Contact'
              
              if (parts.length >= 1) {
                const namePart = parts[0].trim()
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
                first_name: firstName,
                last_name: lastName,
                email,
                company: '',
                phone: '',
                list_names: [listName],
                created_at: new Date().toISOString(),
                source: `Imported from ${file}`,
                imported_at: new Date().toISOString()
              }
              
              const { error: insertError } = await supabaseAdmin
                .from('contacts')
                .insert(newContact)

              if (insertError) {
                throw insertError
              }
              totalImported++
              emailsImported++
              console.log(`✅ Created new contact ${email} with name ${firstName} ${lastName} for list ${listName}`)
            }
                      linesProcessed++
          } catch (emailError) {
            totalErrors++
            linesSkipped++
            results.push({ email: line, error: emailError.message })
            console.error(`❌ Error processing line: ${line}`, emailError.message)
          }
        }
        
        console.log(`   📊 File summary: ${emailsImported} imported, ${linesProcessed} processed, ${linesSkipped} skipped`)
        results.push({ file, listName, emailsImported, linesProcessed, linesSkipped })
        
      } catch (fileError) {
        totalErrors++
        results.push({ file, error: fileError.message })
        console.error(`❌ Error processing file ${file}:`, fileError.message)
      }
    }

    // Get final count
    const { count: finalCount, error: countError } = await supabaseAdmin
      .from('contacts')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      throw countError
    }

    return NextResponse.json({
      success: true,
      message: `Import completed: ${totalImported} new contacts imported, ${totalErrors} errors`,
      summary: {
        totalFiles: files.length,
        totalImported,
        totalErrors,
        finalTotalContacts: finalCount || 0
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