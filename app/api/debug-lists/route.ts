import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'

// GET - Debug: Ver todas las listas y contactos
export async function GET() {
  try {
    const contactsCollection = await getCollection('contacts')
    
    // Obtener todos los contactos
    const allContacts = await contactsCollection.find({}).toArray()
    
    // Analizar las listas
    const listAnalysis = new Map<string, {
      count: number,
      contacts: any[],
      sampleEmails: string[]
    }>()
    
    allContacts.forEach(contact => {
      if (contact.listNames && Array.isArray(contact.listNames)) {
        contact.listNames.forEach(listName => {
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
    
    // También verificar si hay contactos con el campo antiguo listName
    const oldFormatContacts = allContacts.filter(c => c.listName && !c.listNames)
    
    return NextResponse.json({
      success: true,
      summary: {
        totalContacts: allContacts.length,
        totalLists: listsArray.length,
        contactsWithOldFormat: oldFormatContacts.length
      },
      lists: listsArray,
      oldFormatContacts: oldFormatContacts.map(c => ({
        email: c.email,
        listName: c.listName
      })),
      allContacts: allContacts.map(c => ({
        email: c.email,
        listNames: c.listNames || [],
        listName: c.listName || null
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
