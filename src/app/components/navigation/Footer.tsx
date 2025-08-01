import { FaTwitter, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
const Footer = () => (
  <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-gray-300 py-6 text-center">
    <div className="container mx-auto">
      <p>© 2025 AI Content Helper. All rights reserved.</p>
      <div className="flex justify-center space-x-6 mt-4">
        <a href="#" className="hover:text-white transition">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-white transition">
          Terms of Service
        </a>
        <a href="#" className="hover:text-white transition">
          Support
        </a>
      </div>
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
