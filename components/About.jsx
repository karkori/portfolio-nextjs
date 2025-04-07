import React from "react";
import Title from "./Title";

const About = () => {
  return (
    <section id="about" className="py-10 bg-third">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img
              src="/images/about-image.png"
              alt="About Me"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <Title name="About Me" />
            <p className="text-secondary mb-6">
              I'm a passionate Fullstack Developer with over 6 years of experience building scalable and robust applications 
              across diverse industries, from banking to biotech. But beyond the code, I'm someone who loves to learn, explore, and create.
            </p>
            <p className="text-secondary mb-6">
              I'm constantly diving into new technologies—lately, I've been especially focused on exploring AI-based solutions 
              using LLMs, LangChain, and the MCP protocol. I enjoy blogging and sharing technical knowledge with the community, 
              especially through my personal blog and YouTube tutorials. And when I'm not coding, you'll likely find me reading manga, 
              watching anime, or sketching ideas for my next side project.
            </p>
            <p className="text-secondary mb-6">
              What defines me the most is my ability to adapt, evolve, and grow. I'm driven by a desire to build impactful systems, 
              learn continuously, and help others do the same.
            </p>
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 md:w-5 md:h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-secondary">
                  Mid-term goal: become a software architect and technical leader within an agile, product-oriented team.
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 md:w-5 md:h-5 text-teal-500 mt-1 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-secondary">
                  Long-term vision: shape tech strategy at scale, mentor others, and keep building things that truly matter.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
