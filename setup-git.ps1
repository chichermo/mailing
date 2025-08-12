# Script para configurar Git y subir el proyecto
Write-Host "Configurando Git y subiendo proyecto..." -ForegroundColor Green

# 1. Eliminar repositorio Git existente si existe
if (Test-Path ".git") {
    Write-Host "Eliminando repositorio Git existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git
}

# 2. Inicializar nuevo repositorio
Write-Host "Inicializando nuevo repositorio Git..." -ForegroundColor Yellow
git init

# 3. Agregar remote
Write-Host "Agregando remote origin..." -ForegroundColor Yellow
git remote add origin https://github.com/chichermo/mailing.git

# 4. Agregar todos los archivos
Write-Host "Agregando archivos..." -ForegroundColor Yellow
git add .

# 5. Hacer commit inicial
Write-Host "Haciendo commit inicial..." -ForegroundColor Yellow
git commit -m "Initial commit: Complete email marketing system with SendGrid integration"

# 6. Hacer push
Write-Host "Haciendo push a GitHub..." -ForegroundColor Yellow
git push -u origin master

Write-Host "Proyecto subido exitosamente!" -ForegroundColor Green
