# Instrucciones de Instalación - Heliopsismail

## 🔧 Instalación de Node.js

### Opción 1: Descarga Directa (Recomendado)
1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu terminal/PowerShell

### Opción 2: Chocolatey (Windows)
```powershell
choco install nodejs
```

### Opción 3: Scoop (Windows)
```powershell
scoop install nodejs
```

## ✅ Verificar Instalación

Después de instalar Node.js, verifica que esté funcionando:

```bash
node --version
npm --version
```

Deberías ver algo como:
- Node.js v18.17.0
- npm 9.6.7

## 🚀 Instalación del Proyecto

Una vez que Node.js esté instalado:

1. **Instalar dependencias**
```bash
npm install
```

2. **Crear archivo de variables de entorno**
Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_email@example.com
SENDGRID_FROM_NAME=Your Company Name

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_RECOVERY_CODE=your_twilio_recovery_code_here

# Database Configuration
DATABASE_URL=./email_contacts.db

# App Configuration
NEXT_PUBLIC_APP_NAME=Heliopsismail
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 🐛 Solución de Problemas

### Error: "npm no es reconocido"
- **Causa**: Node.js no está instalado o no está en el PATH
- **Solución**: Reinstalar Node.js y reiniciar la terminal

### Error: "node no es reconocido"
- **Causa**: Node.js no está instalado
- **Solución**: Instalar Node.js desde nodejs.org

### Error de dependencias
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error de puerto ocupado
```bash
# Cambiar puerto
npm run dev -- -p 3001
```

## 📱 Requisitos del Sistema

- **Windows**: Windows 10 o superior
- **RAM**: Mínimo 4GB, recomendado 8GB
- **Espacio**: Mínimo 1GB libre
- **Navegador**: Chrome, Firefox, Edge (última versión)

## 🔄 Actualizaciones

Para mantener el proyecto actualizado:

```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Corregir vulnerabilidades
npm audit fix
```

## 📞 Soporte

Si tienes problemas con la instalación:

1. Verifica que Node.js esté instalado correctamente
2. Asegúrate de estar en el directorio correcto del proyecto
3. Revisa que el archivo `.env.local` esté creado
4. Contacta al equipo de desarrollo

---

**¡Listo para usar Heliopsismail! 🎉**
