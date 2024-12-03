// src/components/HeroSection.js
import React from 'react';
import FridgeImage from '../assets/fridge.png'; // Ensure the fridge image is in this path

const HeroSection = () => {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between text-left p-10"
      style={{
        background: "linear-gradient(90deg, #ffb98d, #fdd588, #f4d9a3)"
      }}
    >
      {/* Text Content */}
      <div className="md:w-1/2 flex flex-col items-start">
        <h1
          className="mb-4 leading-tight text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "150px",
            lineHeight: "0.95",
          }}
        >
          Stay Fresh,<br />Waste Less
        </h1>
        <p
          className="text-xl md:text-2xl text-white mb-8"
          style={{
            fontSize: "25px",
          }}
        >
          Maximize freshness, minimize waste – it’s that simple.
        </p>
        
        {/* Get Started Button */}
        <button
          className="bg-purple-600 text-white hover:bg-purple-700 transition rounded-full"
          style={{
            fontSize: "24px", // Larger font size
            padding: "16px 32px", // Increased padding for bigger button
          }}
        >
          Get Started
        </button>
      </div>

      {/* Image */}
      <div className="md:w-1/2 flex justify-center md:justify-end">
        {/* Increase the width with w-3/4 or set a custom size */}
        <img src={FridgeImage} alt="Fridge" className="w-3/4 md:w-full pt-20" />
      </div>
    </section>
  );
};

export default HeroSection;
