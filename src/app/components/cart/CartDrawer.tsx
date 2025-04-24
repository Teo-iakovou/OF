"use client";

import { packages } from "@/app/components/packages/Packages";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  packageData: any; //
  selectedPackageId: string | null;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  selectedPackageId,
  onClose,
  onCheckout,
}: CartDrawerProps) {
  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 w-[350px] h-full bg-black border-l border-gray-700 shadow-lg transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-600">
        <h2 className="text-xl font-bold text-white">Cart • 1 item</h2>
        <button onClick={onClose} className="text-white text-2xl">
          ×
        </button>
      </div>

      {selectedPackage ? (
        <div className="p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">
            {selectedPackage.title}
          </h3>
          <p className="text-green-400 font-bold text-xl mb-4">
            {selectedPackage.price}
          </p>
          <ul className="mb-4">
            {selectedPackage.features.map((f, i) => (
              <li key={i} className="text-sm text-gray-300 mb-1">
                ✅ {f}
              </li>
            ))}
          </ul>

          <button
            onClick={onCheckout}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded"
          >
            Checkout
          </button>
        </div>
      ) : (
        <p className="p-4 text-white">No package selected.</p>
      )}
    </div>
  );
}
