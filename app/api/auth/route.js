// /app/api/auth/route.js
export async function GET(request) {
  console.log("Endpoint de autenticación llamado", new Date().toISOString());
  
  const clientId = process.env.OAUTH_CLIENT_ID;
  console.log("Client ID:", clientId);
  
  const url = request.nextUrl;
  const searchParams = url.searchParams;
  
  // Si tenemos un código, estamos procesando un callback de GitHub
  const code = searchParams.get('code');
  console.log("Código recibido:", code ? "Sí" : "No");
  
  if (code) {
    try {
      console.log("Procesando código OAuth");
      // Intercambiar el código por un token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.OAUTH_CLIENT_ID,
          client_secret: process.env.OAUTH_CLIENT_SECRET,
          code
        })
      });
      
      const tokenData = await tokenResponse.json();
      console.log("Respuesta token:", tokenData.access_token ? "Token recibido" : "Error en token", tokenData.error);
      const accessToken = tokenData.access_token;
      
      // Redireccionar de vuelta al CMS con el token
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/#access_token=${accessToken}`;
      console.log("Redirigiendo a:", redirectUrl);
      return Response.redirect(redirectUrl);
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      return new Response("Error de autenticación: " + error.message, { status: 500 });
    }
  } else {
    // Iniciar el flujo de OAuth redireccionando a GitHub
    // Generar un estado aleatorio para prevenir ataques CSRF
    const state = Math.random().toString(36).substring(2, 15);
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&state=${state}`;
    console.log("Redirigiendo a GitHub:", githubAuthUrl);
    return Response.redirect(githubAuthUrl);
  }
}
