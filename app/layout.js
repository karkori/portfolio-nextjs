import { ThemeProvider } from "@/providers/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from '@/lib/config';
import { GoogleAnalytics } from '@next/third-parties/google'
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
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.title} | ${SITE_CONFIG.author.title}`,
    template: SITE_CONFIG.titleTemplate
  },
  description: SITE_CONFIG.description,
  keywords: ["desarrollador web", "portfolio", "react", "nextjs", "spring boot", "fullstack", "frontend", "backend"],
  authors: [{ name: SITE_CONFIG.author.name }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
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
    title: `${SITE_CONFIG.title} | ${SITE_CONFIG.author.title}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.title,
    locale: SITE_CONFIG.locale,
    type: SITE_CONFIG.seo.openGraph.type,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.author.name} - ${SITE_CONFIG.author.title}`
      }
    ],
  },
  twitter: {
    card: SITE_CONFIG.seo.twitter.cardType,
    title: `${SITE_CONFIG.title} | ${SITE_CONFIG.author.title}`,
    description: SITE_CONFIG.description,
    creator: "@MostaphaKarkori",
    images: ["/images/twitter-card.jpg"],
  },
  verification: {
    // Añade tus códigos de verificación cuando los tengas
    // google: 'GOOGLE-VERIFICATION-CODE',
    // yandex: 'YANDEX-VERIFICATION-CODE',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      'es-ES': SITE_CONFIG.url,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag for analytics */}
        <GoogleAnalytics gaId="G-0XR7FK49YF" />
        
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