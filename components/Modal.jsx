import React from "react";

const Modal = ({ data }) => {
  return (
    <div className="relative">
      <button
        popoverTarget="my-popover"
        className="section-title px-4 py-2 rounded-lg text-center w-full text-lg font-semibold"
      >
        Details
      </button>

      <div
        id="my-popover"
        popover="auto"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
       w-full max-w-2xl p-6 rounded-lg shadow-xl
       transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
       opacity-0 starting:opacity-0 open:opacity-100
       scale-95 starting:scale-95 open:scale-100
       z-50"
      >
        <img
          src={data?.image}
          alt={data?.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6 text-secondary">
          <h3 className="text-xl font-semibold mb-2">{data?.title}</h3>
          <span className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm capitalize">
            {data?.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Modal;
