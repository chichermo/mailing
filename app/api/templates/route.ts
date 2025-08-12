import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'email_contacts.db')

// GET - Obtener plantillas
export async function GET() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    const templates = await db.all('SELECT * FROM email_templates ORDER BY created_at DESC')
    await db.close()

    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error('Error getting templates:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener plantillas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva plantilla
export async function POST(request: NextRequest) {
  try {
    const { name, subject, content, variables } = await request.json()

    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'Nombre, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    const result = await db.run(
      'INSERT INTO email_templates (name, subject, content, variables, created_at) VALUES (?, ?, ?, ?, ?)',
      [name, subject, content, JSON.stringify(variables || []), new Date().toISOString()]
    )

    await db.close()

    return NextResponse.json({
      success: true,
      data: { id: result.lastID, name, subject, content, variables }
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear plantilla' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar plantilla
export async function PUT(request: NextRequest) {
  try {
    const { id, name, subject, content, variables } = await request.json()

    if (!id || !name || !subject || !content) {
      return NextResponse.json(
        { success: false, error: 'ID, nombre, asunto y contenido son requeridos' },
        { status: 400 }
      )
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    await db.run(
      'UPDATE email_templates SET name = ?, subject = ?, content = ?, variables = ? WHERE id = ?',
      [name, subject, content, JSON.stringify(variables || []), id]
    )

    await db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar plantilla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar plantilla
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

    await db.run('DELETE FROM email_templates WHERE id = ?', [id])
    await db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar plantilla' },
      { status: 500 }
    )
  }
}
