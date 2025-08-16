import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const contactsCollection = await getCollection('contacts')
    
    // Delete all contacts
    const deleteResult = await contactsCollection.deleteMany({})
    
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} contacts from database`)
    
    // Get final count (should be 0)
    const finalCount = await contactsCollection.countDocuments()
    
    return NextResponse.json({
      success: true,
      message: `Database reset successfully. Deleted ${deleteResult.deletedCount} contacts.`,
      deletedCount: deleteResult.deletedCount,
      finalTotalContacts: finalCount
    })

  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
