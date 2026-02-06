import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Debug: Ver todas las listas y contactos
export async function GET() {
  try {
    const { data: allContacts, error } = await supabaseAdmin
      .from('contacts')
      .select('id,email,list_names')

    if (error) {
      throw error
    }
    
    // Analizar las listas
    const listAnalysis = new Map<string, {
      count: number,
      contacts: any[],
      sampleEmails: string[]
    }>()
    
    (allContacts || []).forEach(contact => {
      if (contact.list_names && Array.isArray(contact.list_names)) {
        contact.list_names.forEach((listName: string) => {
          if (!listAnalysis.has(listName)) {
            listAnalysis.set(listName, {
              count: 0,
              contacts: [],
              sampleEmails: []
            })
          }
          
          const listData = listAnalysis.get(listName)!
          listData.count++
          listData.contacts.push(contact)
          
          if (listData.sampleEmails.length < 3) {
            listData.sampleEmails.push(contact.email)
          }
        })
      }
    })
    
    // Convertir a array para mejor visualización
    const listsArray = Array.from(listAnalysis.entries()).map(([name, data]) => ({
      listName: name,
      contactCount: data.count,
      sampleEmails: data.sampleEmails
    }))
    
    return NextResponse.json({
      success: true,
      summary: {
        totalContacts: (allContacts || []).length,
        totalLists: listsArray.length,
        contactsWithOldFormat: 0
      },
      lists: listsArray,
      oldFormatContacts: [],
      allContacts: (allContacts || []).map(c => ({
        email: c.email,
        listNames: c.list_names || [],
        listName: null
      }))
    })

  } catch (error) {
    console.error('Error in debug lists:', error)
    return NextResponse.json(
      { success: false, error: 'Error getting debug info' },
      { status: 500 }
    )
  }
}
