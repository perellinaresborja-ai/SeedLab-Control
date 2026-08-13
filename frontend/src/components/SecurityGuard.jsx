import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

// DOMINIOS AUTORIZADOS (Lista Blanca / Whitelist)
// Si alguien copia los archivos y los sube a "dominio-pirata.com", el sistema se bloqueará.
const ALLOWED_DOMAINS = [
  'localhost', 
  '127.0.0.1', 
  'localhost:5174', // Entorno de desarrollo actual
  // Cuando tengas tu dominio real, lo añadiremos aquí (ej: 'midominio.com')
];

export function SecurityGuard({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    
    // Verificamos si el dominio actual está en la lista blanca
    // También permitimos dominios temporales de desarrollo si decides usar Vercel o Netlify para demos
    const isAllowed = ALLOWED_DOMAINS.includes(currentDomain) || 
                      currentDomain.endsWith('.vercel.app') || 
                      currentDomain.endsWith('.netlify.app') ||
                      currentDomain.includes('hostinger');

    if (!isAllowed) {
      setIsAuthorized(false);
      // Aquí en un futuro podríamos añadir un ping a la base de datos para alertarnos del intento de robo
    }

    // Marca de Agua Legal Oculta en Consola (Disuasorio para desarrolladores que intenten inspeccionar)
    console.log(
      "%c ⚠️ ACCESO RESTRINGIDO %c\nEste software es propiedad intelectual exclusiva de SeedLab Control. Queda terminantemente prohibida su copia, clonación, ingeniería inversa o uso no autorizado bajo las leyes internacionales de Propiedad Intelectual. (C) 2027",
      "color: #ef4444; font-size: 24px; font-weight: bold;",
      "color: #94a3b8; font-size: 14px;"
    );
    
    // Desactivar click derecho (Opcional, lo comento para no molestarte a ti durante el uso normal, 
    // pero se puede activar para que nadie pueda inspeccionar el código fácilmente).
    /*
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
    */
    
  }, []);

  // Si alguien ha robado el software y lo ejecuta en otro dominio, verá esta pantalla de bloqueo
  if (!isAuthorized) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center border-t-4 border-t-red-500">
        <ShieldAlert className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-3xl font-bold text-white mb-4">LICENCIA NO AUTORIZADA</h1>
        <p className="text-text-muted max-w-md text-sm leading-relaxed border border-red-500/20 bg-red-500/5 p-4 rounded-lg">
          Esta instancia de <strong>SeedLab Control V2</strong> se está ejecutando en un dominio o servidor no autorizado por el propietario intelectual.
          <br /><br />
          El acceso a la base de datos ha sido revocado. Por favor, póngase en contacto con el departamento de ventas para adquirir una Licencia Enterprise válida.
        </p>
      </div>
    );
  }

  // Si el dominio es correcto (ej: localhost para ti), renderiza la aplicación normal
  return <>{children}</>;
}
