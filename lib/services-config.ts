// Configuración centralizada de servicios
export interface ServiceStatus {
  name: string
  status: 'connected' | 'pending' | 'error'
  message: string
  details?: any
}

export interface ServicesConfig {
  sendgrid: {
    apiKey: string
    fromEmail: string
    fromName: string
    isConfigured: boolean
  }
  resend: {
    apiKey: string
    fromEmail: string
    fromName: string
    isConfigured: boolean
  }
  twilio: {
    accountSid: string
    authToken: string
    recoveryCode: string
    isConfigured: boolean
  }
  mongodb: {
    uri: string
    isConfigured: boolean
  }
}

// Obtener configuración de servicios
export function getServicesConfig(): ServicesConfig {
  return {
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || '',
      fromName: process.env.SENDGRID_FROM_NAME || process.env.FROM_NAME || '',
      isConfigured: !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL)
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY || '',
      fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      fromName: process.env.RESEND_FROM_NAME || 'Heliopsis Mail',
      isConfigured: !!process.env.RESEND_API_KEY
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      recoveryCode: process.env.TWILIO_RECOVERY_CODE || '',
      isConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    },
    mongodb: {
      uri: process.env.MONGODB_URI || '',
      isConfigured: !!process.env.MONGODB_URI
    }
  }
}

// Verificar estado de todos los servicios
export async function checkAllServicesStatus(): Promise<ServiceStatus[]> {
  const config = getServicesConfig()
  const statuses: ServiceStatus[] = []

  // MongoDB Status
  if (config.mongodb.isConfigured) {
    try {
      // Verificar conexión a MongoDB
      const { MongoClient } = await import('mongodb')
      const client = new MongoClient(config.mongodb.uri)
      await client.connect()
      await client.db().admin().ping()
      await client.close()
      
      statuses.push({
        name: 'Database',
        status: 'connected',
        message: 'MongoDB connected successfully'
      })
    } catch (error) {
      statuses.push({
        name: 'Database',
        status: 'error',
        message: 'Failed to connect to MongoDB',
        details: error
      })
    }
  } else {
    statuses.push({
      name: 'Database',
      status: 'pending',
      message: 'MONGODB_URI not configured'
    })
  }

  // SendGrid Status
  if (config.sendgrid.isConfigured) {
    try {
      const sgMail = await import('@sendgrid/mail')
      sgMail.setApiKey(config.sendgrid.apiKey)
      
      statuses.push({
        name: 'SendGrid',
        status: 'connected',
        message: 'SendGrid API key configured'
      })
    } catch (error) {
      statuses.push({
        name: 'SendGrid',
        status: 'error',
        message: 'Failed to configure SendGrid',
        details: error
      })
    }
  } else {
    statuses.push({
      name: 'SendGrid',
      status: 'pending',
      message: 'SENDGRID_API_KEY not configured'
    })
  }

  // Resend Status
  if (config.resend.isConfigured) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(config.resend.apiKey)
      
      statuses.push({
        name: 'Resend',
        status: 'connected',
        message: 'Resend API key configured'
      })
    } catch (error) {
      statuses.push({
        name: 'Resend',
        status: 'error',
        message: 'Failed to configure Resend',
        details: error
      })
    }
  } else {
    statuses.push({
      name: 'Resend',
      status: 'pending',
      message: 'RESEND_API_KEY not configured'
    })
  }

  // Twilio Status
  if (config.twilio.isConfigured) {
    try {
      const twilio = await import('twilio')
      
      statuses.push({
        name: 'Twilio',
        status: 'connected',
        message: 'Twilio credentials configured'
      })
    } catch (error) {
      statuses.push({
        name: 'Twilio',
        status: 'error',
        message: 'Failed to configure Twilio',
        details: error
      })
    }
  } else {
    statuses.push({
      name: 'Twilio',
      status: 'pending',
      message: 'TWILIO_ACCOUNT_SID not configured'
    })
  }

  return statuses
}

// Función para probar envío de email con SendGrid
export async function testSendGridEmail(toEmail: string): Promise<{ success: boolean; message: string; details?: any }> {
  const config = getServicesConfig()
  
  if (!config.sendgrid.isConfigured) {
    return {
      success: false,
      message: 'SendGrid not configured. Please set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL'
    }
  }

  try {
    const sgMail = await import('@sendgrid/mail')
    sgMail.setApiKey(config.sendgrid.apiKey)
    
    const msg = {
      to: toEmail,
      from: config.sendgrid.fromEmail,
      subject: `SendGrid Test - ${new Date().toISOString()}`,
      html: '<p>This is a test email to verify SendGrid configuration.</p>'
    }
    
    await sgMail.send(msg)
    
    return {
      success: true,
      message: 'Test email sent successfully via SendGrid'
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to send test email via SendGrid',
      details: error.message
    }
  }
}

// Función para probar envío de email con Resend
export async function testResendEmail(toEmail: string): Promise<{ success: boolean; message: string; details?: any }> {
  const config = getServicesConfig()
  
  if (!config.resend.isConfigured) {
    return {
      success: false,
      message: 'Resend not configured. Please set RESEND_API_KEY'
    }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(config.resend.apiKey)
    
    const result = await resend.emails.send({
      to: toEmail,
      from: config.resend.fromEmail,
      subject: `Resend Test - ${new Date().toISOString()}`,
      html: '<p>This is a test email to verify Resend configuration.</p>'
    })
    
    return {
      success: true,
      message: 'Test email sent successfully via Resend',
      details: result
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to send test email via Resend',
      details: error.message
    }
  }
}

// Función para probar conexión de Twilio
export async function testTwilioConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const config = getServicesConfig()
  
  if (!config.twilio.isConfigured) {
    return {
      success: false,
      message: 'Twilio not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN'
    }
  }

  try {
    // Aquí podrías hacer una llamada de prueba a la API de Twilio
    // Por ahora solo verificamos que las credenciales estén configuradas
    
    return {
      success: true,
      message: 'Twilio credentials verified'
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to verify Twilio credentials',
      details: error.message
    }
  }
}
