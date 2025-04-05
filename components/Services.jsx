import { services } from "@/lib/data";
import React from "react";
import Title from "./Title";

const Services = () => {
  return (
    <section id="services" className="py-10 bg-primary">
      <div className="container mx-auto px-6">
        <Title name="Technical Services" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-third p-8 rounded-lg shadow-sm hover:shadow-md text-secondary"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 ">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
