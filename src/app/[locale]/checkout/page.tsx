"use client";

import { Suspense, useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  startCheckout,
  subscribeCheckoutInFlight,
  getCheckoutInFlightSnapshot,
  getCheckoutInFlightServerSnapshot,
} from "@/app/utils/api";
import { useUser } from "@/app/hooks/useUser";
import { packages } from "@/app/components/packages/Packages";

const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const personaKey = searchParams.get("personaKey");

  const selectedPackage = packages.find((pkg) => pkg.id === packageId);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user, loading: userLoading } = useUser({ required: true });
  const checkoutInFlight = useSyncExternalStore(
    subscribeCheckoutInFlight,
    getCheckoutInFlightSnapshot,
    getCheckoutInFlightServerSnapshot
  );

  useEffect(() => {
    // useUser enforces auth; nothing to do here
  }, []);

  const handleStripePayment = async () => {
    if (!packageId || loading || checkoutInFlight) return;
    setLoading(true);
    try {
      await startCheckout(packageId, personaKey); // redirects to Stripe
    } catch (error) {
      console.error("Stripe checkout error:", error);
      setLoading(false);
    }
  };

  if (!packageId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl text-red-500 font-bold">No package selected.</h1>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-xl text-gray-300 font-bold">Loading user info...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Complete Your Purchase</h1>

      {selectedPackage ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Checkout: {selectedPackage.title}</h1>
          <p className="text-xl text-gray-400 mb-4">{selectedPackage.features.join(" • ")}</p>
          <p className="text-2xl text-green-400 font-bold mb-6">{selectedPackage.price}</p>
        </>
      ) : (
        <p className="text-red-400">Invalid package</p>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleStripePayment}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-bold"
          disabled={loading || checkoutInFlight}
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

const Checkout = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-xl text-gray-300 font-bold">Loading checkout...</h1>
      </div>
    }
  >
    <CheckoutContent />
  </Suspense>
);

export default Checkout;
