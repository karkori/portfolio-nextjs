import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parámetros dinámicos
    const title = searchParams.get('title') || 'Mostapha.dev';
    const type = searchParams.get('type') || 'website';
    
    // Ajustar el texto secundario según el tipo
    let secondaryText = "Desarrollador Full Stack";
    if (type === 'article') {
      secondaryText = "Blog Post";
    } else if (type === 'category') {
      secondaryText = "Categoría";
    }
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030711',
            backgroundImage: 'linear-gradient(to bottom right, #030711, #1E293B)',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: '20px',
              border: '4px solid #0D9488',
              borderRadius: '15px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '50px', color: '#0D9488', fontWeight: 'bold' }}>Mostapha</span>
              <span style={{ fontSize: '50px', color: '#FFF', fontWeight: 'bold' }}>.dev</span>
            </div>
            
            <h1 style={{ 
              fontSize: '64px', 
              fontWeight: 'bold', 
              color: 'white',
              maxWidth: '1000px',
              marginBottom: '20px',
              lineHeight: 1.2
            }}>
              {title}
            </h1>
            
            <div style={{ 
              display: 'flex', 
              backgroundColor: 'rgba(13, 148, 136, 0.2)', 
              padding: '10px 20px',
              borderRadius: '8px',
              marginTop: '20px',
              alignItems: 'center'
            }}>
              <div style={{ 
                fontSize: '24px', 
                color: '#0D9488',
                fontWeight: 'bold'
              }}>
                {secondaryText}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
