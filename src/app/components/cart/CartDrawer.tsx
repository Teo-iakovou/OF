"use client";

import { packages } from "@/app/components/packages/Packages";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { startCheckout } from "@/app/utils/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, changeQty } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Avoid rendering cart contents until after mount
  if (!isMounted) return null;

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const pkg = packages.find((p) => p.id === item.id);
    if (!pkg) return sum;
    const priceNum = Number(pkg.price.replace(/[^0-9.-]+/g, ""));
    return sum + priceNum * item.quantity;
  }, 0);

  const handleStripePayment = async () => {
    if (!cartItems.length) return;
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      alert("Please log in first.");
      return;
    }
    try {
      await startCheckout(storedEmail, cartItems[0].id);
    } catch (error) {
      console.error("Stripe checkout error:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-[400px] h-full bg-[#232B36] border-l border-[#2e3643] shadow-2xl transition-transform duration-300 z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ maxWidth: 420 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#2e3643] bg-[#1c2330]">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Cart <span className="font-light">•</span>{" "}
          <span className="text-cyan-400">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </h2>
        <button
          onClick={onClose}
          aria-label="Close cart"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[#222735] text-white hover:text-cyan-400 hover:bg-[#232B36] transition border border-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-cyan-500 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {cartItems.length === 0 ? (
          <div className="text-gray-400 py-24 text-center select-none opacity-75 text-base">
            Cart is empty.
          </div>
        ) : (
          cartItems.map((item) => {
            const pkg = packages.find((p) => p.id === item.id);
            if (!pkg) return null;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-[#181F28] rounded-xl shadow border border-[#232B36] px-4 py-4 relative"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-[#222735] rounded-xl overflow-hidden border border-[#2e3643]">
                  <Image
                    src="/5805591578897663447.jpg"
                    alt={pkg.title}
                    width={320}
                    height={320}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0 relative">
                  <button
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:text-red-500 text-gray-400 transition bg-transparent"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="flex flex-col gap-1 mb-6">
                    <div className="font-bold text-lg">{pkg.title}</div>
                    <div className="text-cyan-400 font-semibold text-md">
                      {pkg.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        changeQty(item.id, Math.max(1, item.quantity - 1))
                      }
                      disabled={item.quantity === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-white text-xl bg-[#181F28] hover:bg-[#181F28] hover:text-cyan-400 transition disabled:opacity-60"
                    >
                      −
                    </button>
                    <span className="text-white font-semibold text-lg">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-white text-xl bg-[#181F28] hover:bg-[#181F28] hover:text-cyan-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Footer */}
      <div className="border-t border-[#2e3643] bg-[#232B36] px-6 pt-5 pb-8">
        <div className="flex justify-between items-center text-lg font-bold text-white mb-3">
          <span>Subtotal</span>
          <span className="text-cyan-400">${subtotal}</span>
        </div>
        <button
          disabled={cartItems.length === 0}
          onClick={handleStripePayment}
          className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 transition text-lg font-semibold py-4 rounded-xl shadow-lg disabled:opacity-60"
        >
          Check out • ${subtotal}
        </button>
      </div>
    </div>
  );
}