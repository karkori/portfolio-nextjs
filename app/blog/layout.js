"use client";
import { Inter } from "next/font/google";
import BlogHeader from "@/components/BlogHeader";
import Footer from "@/components/Footer";

export default function BlogLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <BlogHeader />
      <main className="flex-grow pt-24 bg-primary dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}