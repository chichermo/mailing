import { getDb } from './db'
import { dbConfig } from './db-config'

// Initialize database with required collections and indexes
export async function initializeDatabase() {
  try {
    const db = await getDb()
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames: string[] = collections.map((col: any) => col.name)
    
    // Initialize contacts collection
    if (!collectionNames.includes(dbConfig.collections.contacts)) {
      await db.createCollection(dbConfig.collections.contacts)
      console.log('✅ Contacts collection created')
    }
    
    // Initialize templates collection
    if (!collectionNames.includes(dbConfig.collections.templates)) {
      await db.createCollection(dbConfig.collections.templates)
      console.log('✅ Templates collection created')
    }
    
    // Initialize campaigns collection
    if (!collectionNames.includes(dbConfig.collections.campaigns)) {
      await db.createCollection(dbConfig.collections.campaigns)
      console.log('✅ Campaigns collection created')
    }
    
    // Create indexes for better performance
    const contactsCollection = db.collection(dbConfig.collections.contacts)
    await contactsCollection.createIndex({ email: 1 }, { unique: true })
    await contactsCollection.createIndex({ listName: 1 })
    
    const templatesCollection = db.collection(dbConfig.collections.templates)
    await templatesCollection.createIndex({ name: 1 })
    
    const campaignsCollection = db.collection(dbConfig.collections.campaigns)
    await campaignsCollection.createIndex({ createdAt: -1 })
    
    console.log('✅ Database initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    return false
  }
}
