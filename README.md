# Heliopsismail - Sistema de Correos Masivos

Un sistema profesional y moderno para el envío de correos masivos con interfaz de usuario de primera categoría.

## 🚀 Características

- **Dashboard Intuitivo**: Vista general con estadísticas en tiempo real
- **Gestión de Contactos**: CRUD completo con importación CSV
- **Plantillas Personalizables**: Editor HTML con variables dinámicas
- **Envío Masivo**: Campañas programables con límites configurables
- **Historial Detallado**: Seguimiento completo de envíos y métricas
- **Configuración Avanzada**: Integración con SendGrid y Twilio
- **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- **Seguridad**: Manejo de rebotes y enlaces de baja automáticos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS, Headless UI
- **Email**: SendGrid API
- **Notificaciones**: Twilio
- **Base de Datos**: SQLite
- **Despliegue**: Vercel (compatible)

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de SendGrid
- Cuenta de Twilio (opcional)

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd heliopsismail
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env.local` en la raíz del proyecto:
```env
# SendGrid Configuration
SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=tu_email@dominio.com
SENDGRID_FROM_NAME=Tu Nombre

# Twilio Configuration (opcional)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_RECOVERY_CODE=tu_codigo_recuperacion

# Database Configuration
DATABASE_URL=./email_contacts.db

# App Configuration
NEXT_PUBLIC_APP_NAME=Heliopsismail
NEXT_PUBLIC_APP_VERSION=1.0.0
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🏗️ Estructura del Proyecto

```
heliopsismail/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/             # Componentes React
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── ContactList.tsx    # Gestión de contactos
│   ├── EmailTemplates.tsx # Plantillas de correo
│   ├── SendEmails.tsx     # Envío de correos
│   ├── EmailHistory.tsx   # Historial de envíos
│   ├── Settings.tsx       # Configuración
│   └── Sidebar.tsx        # Navegación lateral
├── lib/                    # Utilidades y configuraciones
├── public/                 # Archivos estáticos
└── package.json            # Dependencias del proyecto
```

## 📧 Configuración de SendGrid

1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Generar API Key con permisos de envío
3. Verificar dominio remitente
4. Configurar en el archivo `.env.local`

## 🔧 Configuración de Twilio (Opcional)

1. Crear cuenta en [Twilio](https://twilio.com)
2. Obtener Account SID y Auth Token
3. Configurar webhook para notificaciones
4. Agregar credenciales en `.env.local`

## 🚀 Despliegue en Vercel

1. **Conectar repositorio**
```bash
vercel --prod
```

2. **Configurar variables de entorno en Vercel**
- Ir a Settings > Environment Variables
- Agregar todas las variables del `.env.local`

3. **Desplegar**
```bash
git push origin main
```

## 📊 Uso del Sistema

### 1. Dashboard
- Vista general de estadísticas
- Actividad reciente
- Acciones rápidas

### 2. Gestión de Contactos
- Agregar contactos individuales
- Importar listas CSV
- Filtrar y buscar
- Estados: Activo, Inactivo, Baja

### 3. Plantillas de Correo
- Editor HTML visual
- Variables dinámicas: {{firstName}}, {{lastName}}, {{company}}
- Categorías organizadas
- Vista previa en tiempo real

### 4. Envío de Correos
- Crear campañas
- Seleccionar plantillas
- Elegir listas de destinatarios
- Programar envíos
- Seguimiento en tiempo real

### 5. Historial y Métricas
- Estado de cada envío
- Tasa de entrega, apertura, clics
- Filtros avanzados
- Exportación a CSV

### 6. Configuración
- Credenciales de API
- Límites de envío
- Notificaciones
- Seguridad

## 🔒 Seguridad

- Credenciales encriptadas
- Límites de envío configurables
- Manejo automático de rebotes
- Enlaces de baja automáticos
- Validación de emails

## 📈 Límites Recomendados

- **Emails por hora**: 100-500
- **Emails por día**: 1000-5000
- **Tamaño de lista**: Hasta 10,000 contactos
- **Frecuencia**: Mínimo 24h entre campañas

## 🐛 Solución de Problemas

### Error de conexión SendGrid
- Verificar API Key
- Comprobar límites de cuenta
- Revisar configuración de dominio

### Correos en spam
- Verificar configuración SPF/DKIM
- Usar dominios verificados
- Mantener buena reputación

### Rendimiento lento
- Ajustar límites de envío
- Optimizar plantillas HTML
- Revisar conexión a internet

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@heliopsis.com
- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]

## 🔄 Actualizaciones

- **v1.0.0**: Lanzamiento inicial
- Funcionalidades básicas de envío masivo
- Interfaz moderna y responsive
- Integración con SendGrid y Twilio

---

**Desarrollado con ❤️ por Heliopsis**
