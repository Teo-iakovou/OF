"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { packages } from "@/app/components/Packages";

export default function PackageDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const selectedPackage = packages.find((pkg) => pkg.id === id);

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
      {/* Package Overview Section */}
      <section className="container mx-auto py-16 px-8 flex flex-col lg:flex-row gap-8 items-center">
        {/* Left Side: Image/Visual */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-80 h-80 flex items-center justify-center">
            <img
              src="/5805591578897663447.jpg"
              alt="Logo"
              className="w-60 h-60 object-contain rounded-3xl"
            />
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-6">{selectedPackage.title}</h1>
          <p className="text-3xl font-bold mb-4 text-green-400">
            {selectedPackage.price}
          </p>
          <ul className="space-y-4 text-lg mb-8">
            {selectedPackage.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-green-400">✔</span> {feature}
              </li>
            ))}
          </ul>
          {/* Payment Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/checkout")}
              className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg shadow-md"
            >
              Add to Cart
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg shadow-md"
            >
              Pay with PayPal
            </button>
          </div>
        </div>
      </section>

      {/* Advertising Section */}
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
    </div>
  );
}
