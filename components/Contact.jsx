"use client";
import React from "react";
import Title from "./Title";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-primary">
      <div className="container mx-auto px-6">
        <Title name="Contact Me" />
        
        <p className="text-center text-secondary dark:text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
          Whether you're looking for a backend expert, a fullstack collaborator, or just want to talk tech, 
          feel free to reach out. I'm always open to new challenges, collaborations, and meaningful conversations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
          <div className="bg-third p-8 rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-8 border-b pb-3 border-teal-500/30 dark:border-teal-400/30 text-secondary dark:text-gray-200">
              Contact Information
            </h3>

            <div className="space-y-8">
              <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                <div className="text-3xl mr-5 p-3 bg-teal-500/10 rounded-full flex items-center justify-center w-14 h-14 text-teal-500 dark:text-teal-400">📧</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-lg mb-1 text-secondary dark:text-gray-200">Email</h4>
                  <p className="text-secondary dark:text-gray-300">
                    <a 
                      href="mailto:femtonet.email@gmail.com" 
                      className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                    >
                      femtonet.email@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                <div className="text-3xl mr-5 p-3 bg-teal-500/10 rounded-full flex items-center justify-center w-14 h-14 text-teal-500 dark:text-teal-400">🐙</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-lg mb-1 text-secondary dark:text-gray-200">GitHub</h4>
                  <p className="text-secondary dark:text-gray-300">
                    <a 
                      href="https://github.com/karkori" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                    >
                      @karkori
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                <div className="text-3xl mr-5 p-3 bg-teal-500/10 rounded-full flex items-center justify-center w-14 h-14 text-teal-500 dark:text-teal-400">🔗</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-lg mb-1 text-secondary dark:text-gray-200">LinkedIn</h4>
                  <p className="text-secondary dark:text-gray-300">
                    <a 
                      href="https://linkedin.com/in/mostapha-bourarach" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                    >
                      linkedin.com/in/mostapha-bourarach
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                <div className="text-3xl mr-5 p-3 bg-teal-500/10 rounded-full flex items-center justify-center w-14 h-14 text-teal-500 dark:text-teal-400">🌐</div>
                <div className="pt-1">
                  <h4 className="font-semibold text-lg mb-1 text-secondary dark:text-gray-200">Blog</h4>
                  <p className="text-secondary dark:text-gray-300">
                    <a 
                      href="https://coding.ma" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
                    >
                      coding.ma
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-third p-8 rounded-lg shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-semibold mb-8 border-b pb-3 border-teal-500/30 dark:border-teal-400/30 text-secondary dark:text-gray-200">
              Let's Work Together
            </h3>
            
            <div className="mb-8">
              <p className="text-secondary dark:text-gray-300 mb-6">
                Have a project in mind or want to discuss potential collaborations? 
                I'm just an email away and always excited to hear about new opportunities!
              </p>
              
              <div className="space-y-3">
                <p className="text-secondary dark:text-gray-300">
                  <span className="font-semibold">Response Time:</span> Usually within 24 hours
                </p>
                <p className="text-secondary dark:text-gray-300">
                  <span className="font-semibold">Available for:</span> Freelance, Consulting, Full-time roles
                </p>
              </div>
            </div>
            
            <a 
              href="mailto:femtonet.email@gmail.com"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg px-8 py-4 transition-all duration-300 transform hover:scale-105 shadow-lg dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <div className="flex items-center">
                <span className="mr-2 text-xl">📧</span>
                <span>Send Me a Message</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
