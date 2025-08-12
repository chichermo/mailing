import clientPromise from './mongodb'
import { dbConfig } from './db-config'

export async function getDb() {
  const client = await clientPromise
  return client.db(dbConfig.database)
}

export async function getCollection(collectionName) {
  const db = await getDb()
  return db.collection(collectionName)
}

// Helper function to get specific collections
export async function getContactsCollection() {
  return getCollection(dbConfig.collections.contacts)
}

export async function getTemplatesCollection() {
  return getCollection(dbConfig.collections.templates)
}

export async function getCampaignsCollection() {
  return getCollection(dbConfig.collections.campaigns)
}
