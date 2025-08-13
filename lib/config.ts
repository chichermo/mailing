// Configuration file for environment variables
export const config = {
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || 'guillermoromerog@gmail.com',
    fromName: process.env.SENDGRID_FROM_NAME || process.env.FROM_NAME || 'Heliopsis Mail'
  },
  twilio: {
    recoveryCode: process.env.TWILIO_RECOVERY_CODE || 'KUJ92L3RQVUWUP14NU7ZGKKF'
  }
}

// Validate configuration
if (!config.sendgrid.apiKey) {
  console.error('❌ SENDGRID_API_KEY is not set')
}

if (!config.sendgrid.fromEmail) {
  console.error('❌ FROM_EMAIL is not set')
}

console.log('🔧 Configuration loaded:', {
  sendgrid: {
    apiKey: config.sendgrid.apiKey ? 'SET' : 'MISSING',
    fromEmail: config.sendgrid.fromEmail
  }
})
