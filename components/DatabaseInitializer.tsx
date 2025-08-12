'use client'

import { useEffect } from 'react'
import { initializeDatabase } from '../lib/init-db'

export default function DatabaseInitializer() {
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('🔄 Initializing database...')
        const success = await initializeDatabase()
        if (success) {
          console.log('✅ Database initialized successfully')
        } else {
          console.error('❌ Failed to initialize database')
        }
      } catch (error) {
        console.error('❌ Error during database initialization:', error)
      }
    }

    initDb()
  }, [])

  return null // Este componente no renderiza nada visual
}
