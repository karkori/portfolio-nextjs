"use client";
import About from "@/components/About";
import Contact from "@/components/Contact";
import AreasOfExpertise from "@/components/AreasOfExpertise";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import MyServices from "@/components/MyServices";
import WorkingStyle from "@/components/WorkingStyle";
import Script from "next/script";
import { useEffect } from "react";
import { PersonSchema, WebSiteSchema } from "@/components/SchemaOrg";

export default function Home() {
  // Función para manejar la redirección tras login con Netlify Identity
  useEffect(() => {
    // Verificar si el script de Netlify Identity está cargado
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", user => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });
    }
  }, []);

  return (
    <div className="">
      {/* Schemas para SEO */}
      <PersonSchema />
      <WebSiteSchema />
      
      {/* Script de Netlify Identity */}
      <Script 
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="afterInteractive"
      />
      <Header />
      <Hero />
      <AreasOfExpertise />
      <About />
      <MyServices />
      <Portfolio />
      <WorkingStyle />
      <Contact />
      <Footer />
    </div>
  );
}
