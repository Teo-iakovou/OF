"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { purchasePackage, startCheckout } from "@/app/utils/api"; // 💡 add createStripeSession
import { packages } from "@/app/components/packages/Packages";

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const selectedPackage = packages.find((pkg) => pkg.id === packageId);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handlePurchase = async () => {
    if (!packageId || !email) return;

    setLoading(true);
    try {
      const response = await purchasePackage(email, packageId);
      if (response.message) {
        setSuccess(true);
        localStorage.setItem("userEmail", email);
        router.push("/upload");
      }
    } catch (error) {
      console.error("Manual purchase failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!packageId || !email) return;

    setLoading(true);
    try {
      await startCheckout(email, packageId);
      localStorage.setItem("userEmail", email);
    } catch (error) {
      console.error("Stripe checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!packageId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl text-red-500 font-bold">
          No package selected.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Complete Your Purchase</h1>

      {selectedPackage ? (
        <>
          <h1 className="text-4xl font-bold mb-4">
            Checkout: {selectedPackage.title}
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            {selectedPackage.features.join(" • ")}
          </p>
          <p className="text-2xl text-green-400 font-bold mb-6">
            {selectedPackage.price}
          </p>
        </>
      ) : (
        <p className="text-red-400">Invalid package</p>
      )}

      <input
        type="email"
        placeholder="Enter your email"
        className="p-3 rounded bg-gray-800 text-white border border-gray-700 mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handlePurchase}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-white font-bold"
          disabled={loading || !email}
        >
          {loading ? "Processing..." : "Confirm Purchase"}
        </button>

        <button
          onClick={handleStripePayment}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-bold"
          disabled={loading || !email}
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
      </div>

      {success && (
        <p className="mt-6 text-green-400">
          ✅ Purchase successful! You can now upload your content.
        </p>
      )}
    </div>
  );
};

export default Checkout;
