import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'email_contacts.db')

// GET - Obtener lista de contactos
export async function GET() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    const contacts = await db.all('SELECT * FROM contacts ORDER BY created_at DESC')
    await db.close()

    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error getting contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener contactos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo contacto
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, phone, listName } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Verificar si el email ya existe
    const existing = await db.get('SELECT id FROM contacts WHERE email = ?', [email])
    if (existing) {
      await db.close()
      return NextResponse.json(
        { success: false, error: 'El email ya existe' },
        { status: 400 }
      )
    }

    const result = await db.run(
      'INSERT INTO contacts (first_name, last_name, email, company, phone, list_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, company || '', phone || '', listName || 'General', new Date().toISOString()]
    )

    await db.close()

    return NextResponse.json({
      success: true,
      data: { id: result.lastID, firstName, lastName, email, company, phone, listName }
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear contacto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar contacto
export async function PUT(request: NextRequest) {
  try {
    const { id, firstName, lastName, email, company, phone, listName } = await request.json()

    if (!id || !email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'ID, email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Verificar si el email ya existe en otro contacto
    const existing = await db.get('SELECT id FROM contacts WHERE email = ? AND id != ?', [email, id])
    if (existing) {
      await db.close()
      return NextResponse.json(
        { success: false, error: 'El email ya existe en otro contacto' },
        { status: 400 }
      )
    }

    await db.run(
      'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, company = ?, phone = ?, list_name = ? WHERE id = ?',
      [firstName, lastName, email, company || '', phone || '', listName || 'General', id]
    )

    await db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar contacto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar contacto
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      )
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    await db.run('DELETE FROM contacts WHERE id = ?', [id])
    await db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
