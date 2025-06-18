"use client";
import {
  LayoutDashboard,
  Package,
  Star,
  TrendingUp,
  HelpCircle,
  Users,
  LifeBuoy,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Scrollspy from "react-scrollspy";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-900 text-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-lg">
        <div className="relative flex items-center justify-between md:justify-between w-full">
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none flex items-center space-x-2"
          >
            <Image
              src="/5805591578897663447.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          </Link>

          <div className="flex-1 md:hidden" />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className={`p-2 rounded-md border border-gray-700 bg-[#1f2937] hover:bg-[#374151] text-white transition-all shadow-sm ${
              isMenuOpen ? "z-10" : "z-50"
            }`}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Fullscreen Styled Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#181F28] text-gray-200 z-[60] flex flex-col">
          <div className="flex flex-col justify-between h-full p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold tracking-wide">Menu</h1>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-md bg-[#1f2937] hover:bg-[#374151] text-white transition border border-gray-700 shadow-sm"
              >
                <FiX size={22} />
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
              currentClassName="scrollspy-active"
              offset={-100}
              componentTag="nav"
              className="flex flex-col gap-5 text-lg font-medium"
            >
              {/* Menu Items */}
              {[
                { id: "packages", label: "Products", icon: Package },
                { id: "features", label: "Features", icon: Star },
                { id: "upgrade", label: "Upgrade", icon: TrendingUp },
                { id: "faq", label: "FAQ", icon: HelpCircle },
                { id: "affiliates", label: "Affiliates", icon: Users },
                { id: "help-center", label: "Help Center", icon: LifeBuoy },
                { id: "contact", label: "Contact Us", icon: Mail },
              ].map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-cyan-400 transition flex items-center gap-2"
                >
                  <Icon size={18} />
                  {label}
                </a>
              ))}

              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-cyan-400 transition flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Scrollspy>

            <div className="border-t border-gray-700 my-6" />

            {/* Login */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiUser size={20} />
              <span>Log in</span>
            </Link>

            {/* Social */}
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
    </>
  );
}
