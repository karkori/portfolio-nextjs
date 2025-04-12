"use client";
import React, { useState } from "react";
import Title from "./Title";
import { portfolioItems } from "@/lib/data";
import Image from 'next/image';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [data, setData] = useState(null);

  const filteredItems =
    activeFilter == "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category == activeFilter);

  return (
    <section id="portfolio" className="py-10 bg-primary">
      <div className="container mx-auto px-6">
        <Title name="Projects" />
        <p className="text-center text-secondary max-w-2xl mx-auto mb-12">
          A showcase of my recent projects and technical achievements.
        </p>

        <div className="flex justify-center mb-12 space-x-4">
          {["all", "personal", "professional"].map((filter, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full capitalize ${
                activeFilter === filter
                  ? "bg-teal-500 text-white"
                  : "bg-third text-secondary hover:bg-teal-500/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="bg-third rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent dark:border-gray-700"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs px-2 py-1 bg-teal-500/20 text-teal-500 dark:text-teal-400 rounded-full">
                    {item.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-secondary dark:text-gray-200">{item.title}</h3>
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-teal-500 dark:text-teal-400 mb-1">Technologies</h4>
                  <p className="text-sm text-secondary dark:text-gray-300">{item.technologies}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-teal-500 dark:text-teal-400 mb-1">Description</h4>
                  <p className="text-sm text-secondary dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
