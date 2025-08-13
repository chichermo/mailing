import { MongoClient } from 'mongodb'

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Only initialize connection when actually needed
function getClientPromise(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise
  }

  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  console.log('🔧 MongoDB Configuration:')
  console.log('- URI exists:', !!uri)
  console.log('- URI length:', uri?.length || 0)
  console.log('- NODE_ENV:', process.env.NODE_ENV)

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default getClientPromise()
