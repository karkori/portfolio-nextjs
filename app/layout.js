import { ThemeProvider } from "@/providers/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mostapha.dev'),
  title: {
    default: "Mostapha.dev | Desarrollador Full Stack",
    template: "%s | Mostapha.dev"
  },
  description: "Portfolio profesional de Mostapha Bourarach, desarrollador Full Stack especializado en React, Next.js y Spring Boot",
  keywords: ["desarrollador web", "portfolio", "react", "nextjs", "spring boot", "fullstack", "frontend", "backend"],
  authors: [{ name: "Mostapha Bourarach" }],
  creator: "Mostapha Bourarach",
  publisher: "Mostapha Bourarach",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Mostapha.dev | Desarrollador Full Stack",
    description: "Portfolio profesional de Mostapha Bourarach, desarrollador Full Stack especializado en React, Next.js y Spring Boot",
    url: "https://mostapha.dev",
    siteName: "Mostapha.dev",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mostapha Bourarach - Desarrollador Full Stack"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mostapha.dev | Desarrollador Full Stack",
    description: "Portfolio profesional de Mostapha Bourarach, desarrollador Full Stack especializado en React, Next.js y Spring Boot",
    creator: "@MostaphaKarkori",
    images: ["/images/twitter-card.jpg"],
  },
  verification: {
    // Añade tus códigos de verificación cuando los tengas
    // google: 'GOOGLE-VERIFICATION-CODE',
    // yandex: 'YANDEX-VERIFICATION-CODE',
  },
  alternates: {
    canonical: 'https://mostapha.dev',
    languages: {
      'es-ES': 'https://mostapha.dev',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script para prevenir el flash de modo claro */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Comprobar localStorage y configurar el tema antes de que se cargue cualquier CSS
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'dark'; // Defaultear a dark si no hay preferencia guardada
                  
                  // Aplicar directamente la clase dark al elemento HTML
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  // Fallback en caso de error (modo privado, etc.)
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
