// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} PoliSight.AI All rights reserved.</p>
        {/* <div className="mt-4 space-x-4">
          <a href="/about" className="hover:text-white">
            About
          </a>
          <a href="/pricing" className="hover:text-white">
            Pricing
          </a>
          <a href="/login" className="hover:text-white">
            Login
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
