export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Page - Heliopsis Mail</h1>
      <p>If you can see this, Next.js is working correctly.</p>
      <p>Date and time: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>System status:</h3>
        <ul>
          <li>✅ Next.js running</li>
          <li>✅ React running</li>
          <li>✅ Server responding</li>
        </ul>
      </div>
    </div>
  )
}
