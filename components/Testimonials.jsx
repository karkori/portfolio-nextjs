import React from "react";
import Title from "./Title";

const WorkingStyle = () => {
  const workStyles = [
    {
      icon: "💬",
      title: "Clear Communication",
      description: "Effective communication in multicultural teams with experience working in multiple languages (Spanish, French, English, Arabic). Adaptable to diverse team environments and communication styles.",
      flags: "🇪🇸 🇫🇷 🇬🇧 🇲🇦",
    },
    {
      icon: "🧠",
      title: "Continuous Learning",
      description: "Fast learner and technology explorer, always seeking to expand my skillset. Recently diving into AI technologies, LangChain, and large language models to build innovative solutions.",
    },
    {
      icon: "🔍",
      title: "Quality-Focused",
      description: "Committed to clean code principles, comprehensive testing strategies, and scalable architecture. I believe in doing things right the first time to prevent technical debt.",
    },
    {
      icon: "🤝",
      title: "Value-Driven",
      description: "Always looking to add value beyond the initial requirements. I approach each project with a problem-solving mindset, focusing on business outcomes rather than just technical implementation.",
    },
    {
      icon: "🔄",
      title: "Agile Practitioner",
      description: "Experienced in agile methodologies with a focus on iterative development, continuous feedback, and adaptability to changing requirements while maintaining high quality standards.",
    },
    {
      icon: "🛠️",
      title: "Full Ownership",
      description: "Taking responsibility for the complete development lifecycle, from initial concept through deployment and maintenance, ensuring reliability and performance at each stage.",
    },
  ];

  return (
    <section id="testimonial" className="py-10 bg-third">
      <div className="container mx-auto px-6">
        <Title name="How I Work" />
        <p className="text-center text-secondary max-w-2xl mx-auto mb-12">
          My approach to development and collaboration focuses on these key principles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workStyles.map((item, index) => (
            <div 
              className="bg-primary p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-transparent dark:border-gray-700 h-full flex flex-col" 
              key={index}
            >
              <div className="flex items-start mb-4">
                <div className="text-4xl mr-4 bg-third dark:bg-gray-800 p-3 rounded-lg text-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary dark:text-gray-200 mb-1">{item.title}</h3>
                  {item.flags && (
                    <div className="text-lg mb-2 flex space-x-1">
                      {item.flags.split(' ').map((flag, i) => (
                        <span key={i} className="mr-1">{flag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-secondary dark:text-gray-300 text-sm flex-grow">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkingStyle;
