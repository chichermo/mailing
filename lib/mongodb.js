import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://heliopsis:dkp5vzSTzGwAnx8d@heliopsis.ybqndvo.mongodb.net/?retryWrites=true&w=majority&appName=heliopsis"

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
