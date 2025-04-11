"use client";
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Effect for initial theme setup
  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  // Effect to handle theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Update document classes and attributes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mounted]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}