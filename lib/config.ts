// Configuration file for environment variables
// FORCE REDEPLOYMENT - SENDGRID_API_KEY RECREATED 2025-08-13
export const config = {
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: 'heliopsis@outlook.be', // Use company email as sender
    fromName: 'Heliopsis Mail' // Use company name as sender
  },
  twilio: {
    recoveryCode: process.env.TWILIO_RECOVERY_CODE || 'KUJ92L3RQVUWUP14NU7ZGKKF'
  }
}

// Validate configuration
if (!config.sendgrid.apiKey) {
  console.error('❌ SENDGRID_API_KEY is not set')
}

console.log('🔧 Configuration loaded:', {
  sendgrid: {
    apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
    apiKeyLength: config.sendgrid.apiKey?.length || 0,
    apiKeyPreview: config.sendgrid.apiKey ? config.sendgrid.apiKey.substring(0, 10) + '...' : 'NOT SET',
    fromEmail: config.sendgrid.fromEmail,
    fromName: config.sendgrid.fromName
  }
})
