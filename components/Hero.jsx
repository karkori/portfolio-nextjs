import Link from "next/link";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <section id="home" className="pb-20 pt-32 bg-third">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-secondary">
            <div className="flex items-center mb-4">
              <div className="h-1 w-10 bg-teal-500 mr-2"></div>
              <p className="text-teal-500 font-medium">Fullstack Developer</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
              Hi, I'm <span className="text-teal-500">Mostapha Bourarach</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              Building <span className="text-teal-500">robust</span> and <span className="text-indigo-500">modern</span> digital solutions
            </h2>
            <p className="text-lg mb-8">
              Fullstack Developer with over 6 years of experience in Java, Spring Boot, 
              Angular and cloud technologies. Specialized in scalable architectures
              and high-performance applications.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#contact"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Contact Me
              </Link>
              <Link
                href="/pdf/Mostapha_Bourarach_CV_Fullstack_03_27_2025.pdf"
                className={`border border-teal-600 px-6 py-3 rounded-lg transition-colors flex items-center ${
                  theme === 'dark' ? 'text-white border-teal-500' : 'text-secondary hover:bg-teal-600/10'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Download CV
              </Link>
            </div>
            <div className="flex items-center mt-8 space-x-4">
              <a 
                href="https://github.com/karkori" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  theme === 'dark' 
                    ? 'text-white hover:text-teal-400' 
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/mostapha-bourarach" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`transition-colors ${
                  theme === 'dark' 
                    ? 'text-white hover:text-teal-400' 
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/images/hero-image.jpg"
              alt="Mostapha Bourarach - Fullstack Developer"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
