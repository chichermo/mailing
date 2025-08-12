import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

const dbPath = path.join(process.cwd(), 'email_contacts.db')

// GET - Obtener historial de emails
export async function GET() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    const campaigns = await db.all(`
      SELECT 
        ec.*,
        et.name as template_name
      FROM email_campaigns ec
      LEFT JOIN email_templates et ON ec.template_id = et.id
      ORDER BY ec.created_at DESC
    `)

    await db.close()

    return NextResponse.json({ success: true, data: campaigns })
  } catch (error) {
    console.error('Error getting email history:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener historial' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar campaña del historial
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

    await db.run('DELETE FROM email_campaigns WHERE id = ?', [id])
    await db.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar campaña' },
      { status: 500 }
    )
  }
}
