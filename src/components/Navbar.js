// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-8 z-10">
      <div className="flex justify-between items-center max-w-7xl pl-4 pr-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="ProbabiliEats Logo" className="w-10 h-10" />
          <div className="text-2xl font-bold text-purple-600">ProbabiliEats</div>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
          <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
          <Link to="/recipes" className="text-gray-700 hover:text-purple-600">Recipes</Link> {/* Updated link */}
          <Link to="#about" className="text-gray-700 hover:text-purple-600">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
