import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const mapContactFromDb = (row: any) => ({
  _id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  company: row.company,
  phone: row.phone,
  listNames: row.list_names || [],
  createdAt: row.created_at
})

// GET - Obtener lista de contactos
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: (data || []).map(mapContactFromDb) })
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
    const { firstName, lastName, email, company, phone, listNames } = await request.json()

    if (!email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingError) {
      throw existingError
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'El email ya existe' },
        { status: 400 }
      )
    }

    const newContact = {
      first_name: firstName,
      last_name: lastName || '',
      email,
      company: company || '',
      phone: phone || '',
      list_names: Array.isArray(listNames) ? listNames : [listNames || 'General'],
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('contacts')
      .insert(newContact)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: mapContactFromDb(data)
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
    const { id, firstName, lastName, email, company, phone, listNames } = await request.json()

    if (!id || !email || !firstName) {
      return NextResponse.json(
        { success: false, error: 'ID, email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('contacts')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .maybeSingle()

    if (existingError) {
      throw existingError
    }

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'El email ya existe en otro contacto' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('contacts')
      .update({
        first_name: firstName,
        last_name: lastName || '',
        email,
        company: company || '',
        phone: phone || '',
        list_names: Array.isArray(listNames) ? listNames : [listNames || 'General']
      })
      .eq('id', id)

    if (error) {
      throw error
    }

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

    const { error } = await supabaseAdmin.from('contacts').delete().eq('id', id)
    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar contacto' },
      { status: 500 }
    )
  }
}
