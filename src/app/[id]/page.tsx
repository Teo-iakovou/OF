"use client";
import { useParams } from "next/navigation";
import { packages } from "@/app/components/packages/Packages";
import { useCart } from "@/app/components/cart/CartContext";
import Image from "next/image";
import { useState } from "react";
import CartDrawer from "@/app/components/cart/CartDrawer";
import { startCheckout } from "@/app/utils/api";
import Reveal from "@/app/components/common/Reveal";
// old flow: no inline email modal gating here

export default function PackageDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const selectedPackage = packages.find((pkg) => pkg.id === id);

  // Use global cart state!
  const { cartItems, addToCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  function handleAddToCart(id: string) {
    addToCart(id);
    setCartOpen(true);
  }

  // Checkout: navigate exactly like the cart's checkout button
  const handleCheckout = async () => {
    try {
      // Prefer the package on this page; fallback to first cart item
      const pkgId = selectedPackage?.id || cartItems[0]?.id;
      if (!pkgId) return;
      await startCheckout(pkgId);
    } catch (e) {
      alert("Please sign in to continue.");
    }
  };

  if (!selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <h1 className="text-4xl font-bold text-red-500">
          Package not found. 😔
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181F28] text-white">
      {/* Hero/Product Section */}
      <Reveal as="section" className="flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto pt-20 pb-14 px-4 gap-10">
        {/* Image/Logo Side */}
        <div className="flex-1 w-full flex items-center justify-center md:justify-start mb-8 md:mb-0">
          <Image
            src="/echofy-removebg-preview.png"
            alt={selectedPackage.title}
            width={320}
            height={320}
            className="rounded-2xl object-cover w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80"
            style={{ maxWidth: 320, maxHeight: 320 }}
          />
        </div>
        {/* Info Side */}
        <div className="flex-1 w-full max-w-xl p-0 md:p-8 flex flex-col items-center md:items-start text-center md:text-left md:ml-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {selectedPackage.title}
          </h1>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl md:text-3xl font-semibold text-cyan-400">
              {selectedPackage.price}
            </span>
            <span className="ml-2 text-base text-gray-400">/one-time</span>
          </div>
          <ul className="mb-10">
            {selectedPackage.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center text-lg mb-2 text-gray-200 justify-center md:justify-start"
              >
                <span className="w-6 h-6 flex items-center justify-center mr-2 rounded-full bg-cyan-700 bg-opacity-20">
                  <span className="text-cyan-400">✔</span>
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => handleAddToCart(selectedPackage.id)}
              className="flex-1 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 transition text-lg font-semibold py-3 rounded-xl shadow-lg"
            >
              Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 transition text-lg font-semibold py-3 rounded-xl shadow-lg"
            >
              <span>Buy with</span>
              <span className="font-bold text-white text-lg tracking-tight">
                shop
              </span>
              <span className="bg-white text-[#5A31F4] font-bold text-sm px-1 py-0.5 rounded">
                Pay
              </span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* Divider */}
      <div className="max-w-4xl mx-auto border-t border-[#2e3643] my-12" />

      {/* Marketing/Info Section */}
      <Reveal as="section" className="max-w-4xl mx-auto text-center px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Why Choose Us?
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Unlock the power of AI analytics with our advanced packages. Choose a
          plan that fits your needs and take your content to the next level!
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-700 hover:to-fuchsia-700 transition text-white px-6 py-3 rounded-full shadow-md font-semibold">
            Learn More
          </button>
          <button className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 transition text-white px-6 py-3 rounded-full shadow-md font-semibold">
            Testimonials
          </button>
        </div>
      </Reveal>

      {/* Slide-in Cart Drawer (context manages items) */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Auth is required for checkout; handled server-side */}
    </div>
  );
}
