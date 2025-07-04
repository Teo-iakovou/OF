"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { purchasePackage, startCheckout } from "@/app/utils/api";
import { packages } from "@/app/components/packages/Packages";

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const selectedPackage = packages.find((pkg) => pkg.id === packageId);

  // Get email from localStorage only
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
    else {
      // If no email, redirect to login or show a modal
      router.replace("/"); // or your login page or modal logic
    }
    // eslint-disable-next-line
  }, []);

  const handlePurchase = async () => {
    if (!packageId || !email) return;

    setLoading(true);
    try {
      const response = await purchasePackage(email, packageId);
      if (response.message) {
        setSuccess(true);
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

  // Optional: Loading UI while checking for email
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-xl text-gray-300 font-bold">
          Loading user info...
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

      <div className="flex gap-4">
        <button
          onClick={handlePurchase}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-white font-bold"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Purchase"}
        </button>

        <button
          onClick={handleStripePayment}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-bold"
          disabled={loading}
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
