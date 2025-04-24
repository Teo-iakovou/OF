"use client";

import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Scrollspy from "react-scrollspy";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo Icon with Home Link */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/5805591578897663447.jpg"
            alt="Logo"
            className="h-10 w-auto object-contain rounded-full"
          />
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Fullscreen Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#131313] z-40 flex flex-col">
          <div className="flex flex-col justify-between h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold tracking-wide text-white">
                Menu
              </h1>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <FiX size={28} />
              </button>
            </div>

            {/* Scrollspy Links */}
            <Scrollspy
              items={[
                "packages",
                "features",
                "upgrade",
                "faq",
                "affiliates",
                "help-center",
                "contact",
              ]}
              currentClassName="text-pink-500"
              offset={-100}
              componentTag="nav"
              className="flex flex-col gap-5 text-lg font-semibold tracking-wide"
            >
              <a
                href="#packages"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                PRODUCTS
              </a>
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                FEATURES
              </a>
              <a
                href="#upgrade"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                UPGRADE
              </a>
              <a
                href="#faq"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                FAQ
              </a>
              <a
                href="#affiliates"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                Affiliates
              </a>
              <a
                href="#help-center"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                Help Center
              </a>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-pink-400 transition"
              >
                Contact Us
              </a>
            </Scrollspy>

            {/* Divider */}
            <div className="border-t border-gray-700 my-6" />

            {/* Log In */}
            <a
              href="/login"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <FiUser size={20} />
              <span>Log in</span>
            </a>

            {/* Social Media Links */}
            <div className="flex gap-6 text-gray-400">
              <a
                href="https://twitter.com"
                target="_blank"
                className="hover:text-white"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                className="hover:text-white"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                className="hover:text-white"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                className="hover:text-white"
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
