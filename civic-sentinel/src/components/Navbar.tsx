// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          <Link to="/">Civic_ai</Link>
        </div>
        <div className="space-x-6">
          <Link to="/about" className="text-gray-700 hover:text-primary">
            About
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-primary">
            Pricing
          </Link>
          <Link to="/login" className="text-gray-700 hover:text-primary">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
