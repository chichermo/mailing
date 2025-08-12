import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'

// GET - Obtener historial de emails
export async function GET() {
  try {
    const campaignsCollection = await getCollection('campaigns')
    const campaigns = await campaignsCollection.find({}).sort({ createdAt: -1 }).toArray()

    // Get template names for each campaign
    const campaignsWithTemplateNames = await Promise.all(
      campaigns.map(async (campaign: any) => {
        if (campaign.templateId) {
          const templatesCollection = await getCollection('templates')
          const template = await templatesCollection.findOne({ _id: new ObjectId(campaign.templateId) })
          return {
            ...campaign,
            template_name: template?.name || 'Unknown Template'
          }
        }
        return {
          ...campaign,
          template_name: 'Custom Campaign'
        }
      })
    )

    return NextResponse.json({ success: true, data: campaignsWithTemplateNames })
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

    const campaignsCollection = await getCollection('campaigns')
    await campaignsCollection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar campaña' },
      { status: 500 }
    )
  }
}
