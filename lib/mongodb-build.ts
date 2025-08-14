// Este archivo se usa solo durante el BUILD para evitar conexiones a MongoDB
export function getClientPromise(): Promise<any> {
  // Durante el BUILD, retornamos una promesa que nunca se resuelve
  // Esto evita que se ejecute la conexión a MongoDB
  return new Promise(() => {
    // Esta promesa nunca se resuelve durante el BUILD
    console.log('🚫 MongoDB connection blocked during build phase')
  })
}
