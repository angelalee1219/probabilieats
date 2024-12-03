// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div
      className="w-64 h-full flex flex-col p-6"
      style={{
        background: "linear-gradient(90deg, #ffb98d, #fdd588, #f4d9a3)", // Your gradient colors
        color: '#5e42a6', // Vibrant purple for text
      }}
    >
      <div className="flex flex-col space-y-4">
        {/* Navigation Links with 'end' prop for exact match */}
        <NavLink 
          to="/dashboard" 
          end // Ensures this link is only active on the exact path "/dashboard"
          className={({ isActive }) => 
            `text-left hover:text-purple-800 ${isActive ? 'text-purple-800 font-bold' : 'text-white'}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/dashboard/environmental-impact"  
          className={({ isActive }) => 
            `text-left hover:text-purple-800 ${isActive ? 'text-purple-800 font-bold' : 'text-white'}`}
        >
          Environmental Impact
        </NavLink>
        <NavLink 
          to="/dashboard/fridge" 
          className={({ isActive }) => 
            `text-left hover:text-purple-800 ${isActive ? 'text-purple-800 font-bold' : 'text-white'}`}
        >
          Fridge
        </NavLink>
        <NavLink 
          to="/dashboard/settings" 
          className={({ isActive }) => 
            `text-left hover:text-purple-800 ${isActive ? 'text-purple-800 font-bold' : 'text-white'}`}
        >
          Settings
        </NavLink>
      </div>
      <button className="mt-auto text-left text-red-500 hover:text-red-400">Log out</button>
    </div>
  );
};

export default Sidebar;
