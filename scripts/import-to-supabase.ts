import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Uso: npx ts-node scripts/import-to-supabase.ts <archivo.json|csv>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

type ContactInput = {
  first_name: string
  last_name?: string
  email: string
  company?: string
  phone?: string
  list_names?: string[]
  created_at?: string
}

const parseCsv = (content: string): ContactInput[] => {
  const lines = content.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  if (lines.length === 0) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows = lines.slice(1)

  return rows.map((row) => {
    const cols = row.split(',').map(col => col.trim())
    const record: any = {}
    headers.forEach((header, index) => {
      record[header] = cols[index]
    })

    const listNames = record.list_names
      ? String(record.list_names).split(';').map((name: string) => name.trim()).filter(Boolean)
      : undefined

    return {
      first_name: record.first_name || 'Imported',
      last_name: record.last_name || '',
      email: record.email,
      company: record.company || '',
      phone: record.phone || '',
      list_names: listNames,
      created_at: record.created_at || new Date().toISOString()
    }
  })
}

const parseJson = (content: string): ContactInput[] => {
  const data = JSON.parse(content)
  if (!Array.isArray(data)) {
    throw new Error('El JSON debe ser un array de contactos')
  }

  return data.map((item: any) => ({
    first_name: item.first_name || item.firstName || 'Imported',
    last_name: item.last_name || item.lastName || '',
    email: item.email,
    company: item.company || '',
    phone: item.phone || '',
    list_names: item.list_names || item.listNames || ['General'],
    created_at: item.created_at || item.createdAt || new Date().toISOString()
  }))
}

const loadContacts = (): ContactInput[] => {
  const absolutePath = path.resolve(process.cwd(), filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')

  if (absolutePath.endsWith('.json')) {
    return parseJson(content)
  }

  if (absolutePath.endsWith('.csv')) {
    return parseCsv(content)
  }

  throw new Error('Formato no soportado. Usa .json o .csv')
}

const chunk = <T>(items: T[], size: number) => {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function run() {
  const contacts = loadContacts().filter(contact => !!contact.email)

  if (contacts.length === 0) {
    console.log('No hay contactos para importar.')
    return
  }

  let inserted = 0
  for (const batch of chunk(contacts, 500)) {
    const { error } = await supabase
      .from('contacts')
      .upsert(batch, { onConflict: 'email' })

    if (error) {
      throw error
    }

    inserted += batch.length
    console.log(`Importados ${inserted} contactos...`)
  }

  console.log(`✅ Importación completada: ${inserted} contactos`)
}

run().catch((error) => {
  console.error('Error al importar:', error)
  process.exit(1)
})
