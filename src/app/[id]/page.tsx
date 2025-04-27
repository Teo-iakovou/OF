"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { packages } from "@/app/components/packages/Packages";
import CartDrawer from "@/app/components/cart/CartDrawer"; // Make sure this path is correct

export default function PackageDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const selectedPackage = packages.find((pkg) => pkg.id === id);

  const [showCart, setShowCart] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleCheckout = async () => {
    if (!selectedPackage) return;

    try {
      let email = localStorage.getItem("userEmail");

      if (!email) {
        email = prompt("Enter your email:");
        if (!email) return; // User cancelled
        localStorage.setItem("userEmail", email); // ✅ Save it for next time
      }

      if (email !== "testuser@gmail.com") {
        alert("Access restricted: Only testuser@gmail.com is allowed.");
        return; // ❌ Stop everything
      }

      const response = await fetch(
        `${BASE_URL}/api/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, packageId: selectedPackage.id }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // ✅ Redirect to Stripe Checkout
      }
    } catch (err) {
      console.error("Failed to start Stripe checkout:", err);
    }
  };

  const handleCartClick = () => {
    setShowCart(true);
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
    <div className="min-h-screen bg-of-background text-white">
      {/* Main Package Section */}
      <section className="container mx-auto py-16 px-8 flex flex-col lg:flex-row gap-8 items-center">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src="/5805591578897663447.jpg"
              alt={selectedPackage.title}
              className="w-60 h-60 object-contain rounded-3xl"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-6">{selectedPackage.title}</h1>
          <p className="text-3xl font-bold mb-4 text-green-400">
            {selectedPackage.price}
          </p>
          <ul className="space-y-4 text-lg mb-8">
            {selectedPackage.features.map((feature, idx) => (
              <li
                key={`${selectedPackage.id}-${idx}`}
                className="flex items-center gap-2"
              >
                <span className="text-green-400">✔</span> {feature}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCartClick}
              className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-xl text-white font-bold rounded-lg shadow-md"
            >
              Add to Cart
            </button>
            <button
              onClick={handleCheckout}
              className="w-full bg-[#5A31F4] hover:bg-[#4b27d4] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 shadow-md"
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
      </section>

      {/* Marketing Section */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-16">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Why Choose Us?</h2>
          <p className="text-xl mb-8">
            Unlock the power of AI analytics with our advanced packages. Choose
            a plan that fits your needs and take your content to the next level!
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-black px-6 py-3 rounded-full shadow-md hover:bg-gray-100 font-semibold">
              Learn More
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-full shadow-md hover:bg-gray-100 font-semibold">
              Testimonials
            </button>
          </div>
        </div>
      </section>

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        selectedPackageId={selectedPackage.id}
        onCheckout={handleCheckout}
        packageData={{
          title: selectedPackage.title,
          price: selectedPackage.price,
          features: selectedPackage.features,
        }}
      />
    </div>
  );
}
