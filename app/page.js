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
import Head from "next/head";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Mostapha.dev</title>
        <meta name="description" content="Fullstack developer" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
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
