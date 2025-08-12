// Database configuration for MongoDB
export const dbConfig = {
  database: 'heliopsismail',
  collections: {
    contacts: 'contacts',
    templates: 'templates',
    campaigns: 'campaigns'
  }
}

// Validate database configuration
export function validateDbConfig() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set')
    return false
  }
  
  console.log('✅ MongoDB configuration validated')
  return true
}
