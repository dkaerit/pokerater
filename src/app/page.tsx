import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting...',
  noindex: true, // Evita que los motores de búsqueda indexen esta página de redirección
};

const HomePage = () => {
  return (
    <html>
      <head>
        {/* Agrega la ruta base para la redirección en gh-pages */}
        <meta http-equiv="refresh" content="0;url=/pokerater/es" /> 
      </head>
      <body>
        {/* Opcional: Contenido para navegadores que no soportan meta refresh */}
        <p>Redirigiendo a la versión en español...</p>
      </body>
    </html>
  );
};

export default HomePage;
