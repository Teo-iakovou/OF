"use client";

import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Icon with Home Link */}
        <a href="/" className="flex items-center space-x-2">
          <img
            src="/5805591578897663447.jpg"
            alt="Logo"
            className="h-10 w-auto object-contain rounded-full"
          />
        </a>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Hamburger Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-40">
          <div className="flex flex-col text-white p-6">
            {/* Menu Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold">Menu</h1>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col space-y-6 text-lg font-medium">
              <a
                href="#packages"
                className="hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                PRICING
              </a>
              <a href="#features" className="hover:text-gray-300">
                FEATURES
              </a>
              <a href="#upgrade" className="hover:text-gray-300">
                UPGRADE
              </a>

              <a href="#faq" className="hover:text-gray-300">
                FAQ
              </a>
              <a href="#affiliates" className="hover:text-gray-300">
                Affiliates
              </a>
              <a href="#help-center" className="hover:text-gray-300">
                Help Center
              </a>

              <a href="#contact" className="hover:text-gray-300">
                Contact Us
              </a>
            </nav>

            {/* Log In */}
            <div className="mt-8">
              <a
                href="/login"
                className="flex items-center gap-2 hover:text-gray-300"
              >
                <FiUser size={20} />
                <span>Log in</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6 mt-12">
              <a
                href="https://twitter.com"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                className="hover:text-gray-300"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
