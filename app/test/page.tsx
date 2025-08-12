export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Página de Prueba - Heliopsis Mail</h1>
      <p>Si puedes ver esto, Next.js está funcionando correctamente.</p>
      <p>Fecha y hora: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Estado del sistema:</h3>
        <ul>
          <li>✅ Next.js funcionando</li>
          <li>✅ React funcionando</li>
          <li>✅ Servidor respondiendo</li>
        </ul>
      </div>
    </div>
  )
}
