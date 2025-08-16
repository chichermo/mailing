# Configuración de Servicios - Heliopsismail

Esta guía te ayudará a configurar todos los servicios necesarios para que tu aplicación funcione correctamente.

## 🗄️ MongoDB (Base de Datos)

### 1. Crear cuenta en MongoDB Atlas
- Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
- Crea una cuenta gratuita
- Crea un nuevo cluster (gratuito)

### 2. Obtener URI de conexión
- En tu cluster, haz clic en "Connect"
- Selecciona "Connect your application"
- Copia la URI de conexión

### 3. Configurar variable de entorno
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## 📧 SendGrid (Envío de Emails)

### 1. Crear cuenta en SendGrid
- Ve a [SendGrid](https://sendgrid.com)
- Crea una cuenta gratuita (hasta 100 emails/día)

### 2. Generar API Key
- Ve a Settings > API Keys
- Crea una nueva API Key con permisos de "Mail Send"
- Copia la API Key

### 3. Verificar dominio remitente
- Ve a Settings > Sender Authentication
- Verifica tu dominio o usa el dominio de SendGrid

### 4. Configurar variables de entorno
```env
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=your_email@yourdomain.com
SENDGRID_FROM_NAME=Your Company Name
```

## 🚀 Resend (Alternativa a SendGrid)

### 1. Crear cuenta en Resend
- Ve a [Resend](https://resend.com)
- Crea una cuenta gratuita (hasta 3,000 emails/mes)

### 2. Obtener API Key
- En tu dashboard, copia la API Key
- Comienza con `re_`

### 3. Configurar variables de entorno
```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=your_email@yourdomain.com
RESEND_FROM_NAME=Your Company Name
```

## 📱 Twilio (Notificaciones SMS)

### 1. Crear cuenta en Twilio
- Ve a [Twilio](https://twilio.com)
- Crea una cuenta gratuita
- Verifica tu número de teléfono

### 2. Obtener credenciales
- En tu dashboard, copia:
  - Account SID
  - Auth Token
  - Recovery Code

### 3. Configurar variables de entorno
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_RECOVERY_CODE=your_recovery_code_here
```

## 🔧 Configuración en Vercel

### 1. Ir a tu proyecto en Vercel
- Ve a [Vercel Dashboard](https://vercel.com/dashboard)
- Selecciona tu proyecto

### 2. Configurar variables de entorno
- Ve a Settings > Environment Variables
- Agrega todas las variables del archivo `.env.example`

### 3. Variables requeridas mínimas
```env
MONGODB_URI=your_mongodb_uri
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_email
```

## 🧪 Probar la configuración

### 1. Verificar estado del sistema
- Ve a tu aplicación desplegada
- En el Dashboard, verás el estado de todos los servicios
- Los servicios configurados mostrarán "Connected"

### 2. Probar envío de emails
- Usa los botones "Probar" en el Dashboard
- Verifica que recibas emails de prueba

### 3. Verificar logs
- En Vercel, ve a Functions > View Function Logs
- Busca mensajes de éxito o error

## 🚨 Solución de problemas comunes

### SendGrid no funciona
- Verifica que la API Key tenga permisos de "Mail Send"
- Asegúrate de que el email remitente esté verificado
- Revisa los logs de SendGrid para errores

### MongoDB no se conecta
- Verifica que la URI sea correcta
- Asegúrate de que la IP esté en la whitelist de MongoDB
- Verifica que el usuario y contraseña sean correctos

### Twilio no responde
- Verifica que las credenciales sean correctas
- Asegúrate de que tu cuenta esté verificada
- Revisa que tengas saldo en tu cuenta

## 📊 Monitoreo

### Estado en tiempo real
- El Dashboard muestra el estado actual de todos los servicios
- Actualiza automáticamente cada vez que cargas la página
- Usa el botón "Actualizar" para verificar cambios

### Logs de sistema
- Todas las operaciones se registran en la consola
- En Vercel, puedes ver los logs en tiempo real
- Los errores se muestran claramente con detalles

## 🔐 Seguridad

### Variables de entorno
- Nunca commits credenciales en el código
- Usa variables de entorno para todas las configuraciones sensibles
- En Vercel, las variables están encriptadas

### API Keys
- Rota las API Keys regularmente
- Usa permisos mínimos necesarios
- Monitorea el uso de las APIs

## 📈 Escalabilidad

### SendGrid
- Plan gratuito: 100 emails/día
- Planes pagos: desde $14.95/mes por 50,000 emails

### Resend
- Plan gratuito: 3,000 emails/mes
- Planes pagos: desde $20/mes por 50,000 emails

### MongoDB
- Plan gratuito: 512MB
- Planes pagos: desde $9/mes por 2GB

## 🆘 Soporte

### Documentación oficial
- [SendGrid API Docs](https://sendgrid.com/docs/api-reference/)
- [Resend API Docs](https://resend.com/docs/api-reference)
- [Twilio API Docs](https://www.twilio.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Comunidad
- GitHub Issues en tu repositorio
- Stack Overflow con tag `heliopsismail`
- Discord de desarrolladores

---

**¡Con esta configuración, tu aplicación estará completamente funcional!** 🎉
