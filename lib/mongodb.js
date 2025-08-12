import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://heliopsis:dkp5vzSTzGwAnx8d@heliopsis.ybqndvo.mongodb.net/heliopsis?retryWrites=true&w=majority&tls=true&ssl=true"

console.log('🔧 MongoDB Configuration:')
console.log('- URI exists:', !!uri)
console.log('- URI length:', uri?.length || 0)
console.log('- NODE_ENV:', process.env.NODE_ENV)

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
