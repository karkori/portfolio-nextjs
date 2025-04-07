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

export const metadata = {
  title: "Mostapha.dev",
  description: "Fullstack developer",
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
