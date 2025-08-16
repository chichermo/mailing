import { NextResponse } from 'next/server'
import { checkAllServicesStatus } from '@/lib/services-config'

export async function GET() {
  try {
    console.log('🔍 Checking system status...')
    
    const servicesStatus = await checkAllServicesStatus()
    
    console.log('📊 Services status:', servicesStatus)
    
    return NextResponse.json({
      success: true,
      message: 'System status retrieved successfully',
      data: {
        timestamp: new Date().toISOString(),
        services: servicesStatus,
        summary: {
          total: servicesStatus.length,
          connected: servicesStatus.filter(s => s.status === 'connected').length,
          pending: servicesStatus.filter(s => s.status === 'pending').length,
          error: servicesStatus.filter(s => s.status === 'error').length
        }
      }
    })
  } catch (error: any) {
    console.error('❌ Error checking system status:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check system status',
      details: error.message
    }, { status: 500 })
  }
}
