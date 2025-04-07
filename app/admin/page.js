"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBlock() {
  const router = useRouter();
  
  useEffect(() => {
    // Verifica si está en producción (no localhost)
    const isProduction = !window.location.hostname.includes('localhost');
    
    if (isProduction) {
      // En producción, redirige a la página principal
      router.push('/');
    } else {
      // En desarrollo local, redirige al admin
      window.location.href = '/admin/index.html';
    }
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Cargando panel de administración...</h1>
        <p>Si no eres redirigido automáticamente, por favor espera un momento.</p>
      </div>
    </div>
  );
}
