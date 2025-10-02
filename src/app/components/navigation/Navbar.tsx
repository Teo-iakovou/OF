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
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import Scrollspy from "react-scrollspy";
import Image from "next/image";
import { useCart } from "../cart/CartContext"; // Make sure the path is correct!
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";

type NavbarProps = {
  onCartClick: () => void;
};

function hasPrefetch(r: unknown): r is { prefetch: (href: string) => void } {
  const candidate = r as Record<string, unknown>;
  return typeof candidate?.prefetch === "function";
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount } = useCart();
  const { user } = useUser({ required: false });
  const router = useRouter();

  // Avoid hydration mismatch for client-only cart count badge
  useEffect(() => setMounted(true), []);

  // Prefetch dashboard route for instant navigation when authenticated
  useEffect(() => {
    if (user) {
      try {
        if (hasPrefetch(router)) {
          router.prefetch("/dashboard");
        }
      } catch {}
    }
  }, [user, router]);

  return (
    <>
      <nav className="bg-gray-900 text-white py-4 px-6 fixed top-0 left-0 w-full z-50 shadow-lg">
        <div className="relative flex items-center justify-between md:justify-between w-full">
          {/* LOGO */}
          <Link
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none flex items-center space-x-2"
          >
            <Image
              src="/echofy-removebg-preview.png"
              alt="Logo"
              width={70}
              height={70}
              className="rounded-full object-contain"
            />
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            {/* CART BUTTON */}
            <button
              onClick={onCartClick}
              className="relative p-1 hover:text-cyan-400 transition bg-transparent border-none shadow-none"
              aria-label="View cart"
              style={{ background: "transparent" }}
            >
              <ShoppingBag size={28} />
              {mounted && cartCount > 0 && (
<span
  className="
    absolute -top-2 -right-2 flex items-center justify-center
    bg-gradient-to-tr from-cyan-400 to-blue-600 text-white text-xs
    rounded-full w-5 h-5 font-bold shadow z-10
  "
>
  {cartCount || 0}
</span>
              )}
            </button>

            {/* MENU BUTTON */}
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
                className="
    flex items-center justify-center
    w-9 h-9
    rounded-full
    bg-[#222735]
    text-white
    hover:text-cyan-400
    hover:bg-[#232B36]
    transition
    border border-gray-700
    shadow
    focus:outline-none
    focus:ring-2 focus:ring-cyan-500
    text-2xl
    font-bold
  "
              >
                ×
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
                prefetch
                onClick={() => {
                  setIsMenuOpen(false);
                  try { window.dispatchEvent(new Event("route-transition-start")); } catch {}
                }}
                className="hover:text-cyan-400 transition flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Scrollspy>

            <div className="border-t border-gray-700 my-6" />

            {/* Auth action (dynamic) */}
            {/* Always show a Log in icon */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                if (user) {
                  try { sessionStorage.setItem("justLoggedIn", "1"); } catch {}
                  router.replace("/");
                } else {
                  router.push("/login?redirect=/");
                }
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
              aria-label="Log in"
            >
              <FiUser size={20} />
              <span>Log in</span>
            </button>

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
