const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'email_contacts.db')

async function initDatabase() {
  try {
    console.log('Inicializando base de datos...')
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Crear tabla de contactos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        email TEXT UNIQUE NOT NULL,
        company TEXT,
        phone TEXT,
        list_name TEXT DEFAULT 'General',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de plantillas de email
    await db.exec(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        variables TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crear tabla de campañas de email
    await db.exec(`
      CREATE TABLE IF NOT EXISTS email_campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        template_id INTEGER,
        list_name TEXT,
        subject TEXT NOT NULL,
        total_sent INTEGER DEFAULT 0,
        success_count INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES email_templates (id)
      )
    `)

    // Insertar datos de ejemplo
    await db.run(`
      INSERT OR IGNORE INTO contacts (first_name, last_name, email, company, phone, list_name)
      VALUES 
        ('Juan', 'Pérez', 'juan.perez@ejemplo.com', 'Empresa A', '+34 123 456 789', 'Clientes'),
        ('María', 'García', 'maria.garcia@ejemplo.com', 'Empresa B', '+34 987 654 321', 'Prospectos'),
        ('Carlos', 'López', 'carlos.lopez@ejemplo.com', 'Empresa C', '+34 555 123 456', 'Clientes')
    `)

    await db.run(`
      INSERT OR IGNORE INTO email_templates (name, subject, content, variables)
      VALUES 
        ('Bienvenida', '¡Bienvenido {{firstName}}!', 
         '<h1>¡Hola {{firstName}}!</h1><p>Gracias por unirte a nuestra lista de correos.</p><p>Saludos,<br>El equipo de Heliopsis</p>',
         '["firstName", "lastName", "email"]'),
        ('Promoción', 'Oferta especial para {{firstName}}', 
         '<h1>¡Oferta especial!</h1><p>Hola {{firstName}}, tenemos una oferta especial para ti.</p><p>¡No te la pierdas!</p>',
         '["firstName", "company"]')
    `)

    await db.close()
    console.log('✅ Base de datos inicializada correctamente')
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error)
    process.exit(1)
  }
}

initDatabase()
