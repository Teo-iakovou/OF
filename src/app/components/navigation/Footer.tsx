"use client";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useConsent } from "@/app/components/consent/ConsentContext";
const Footer = () => (
  <footer className="bg-gradient-to-r from-[#050819] via-[#030411] to-[#010208] text-gray-300 py-8 text-center border-t border-white/10">
    <div className="container mx-auto">
      <p>© 2025 AI Content Helper. All rights reserved.</p>
      <FooterLinks />
      <div className="flex justify-center space-x-6 mt-6">
        <a
          href="https://twitter.com"
          target="_blank"
          className="hover:text-blue-400 transition"
        >
          <FaTwitter size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          className="hover:text-pink-400 transition"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          className="hover:text-gray-400 transition"
        >
          <FaTiktok size={20} />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          className="hover:text-red-400 transition"
        >
          <FaYoutube size={20} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;

function FooterLinks() {
  const { open } = useConsent();
  return (
    <div className="flex justify-center flex-wrap gap-6 mt-4">
      <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
      <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
      <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
      <button onClick={open} className="hover:text-white transition underline underline-offset-2">Cookie preferences</button>
    </div>
  );
}
