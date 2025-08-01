"use client";

import Link from "next/link";

export const packages = [
  {
    id: "lite",
    title: "Lite",
    price: "$49",
    features: ["Basic Analytics", "5 Uploads/Day", "Email Support"],
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "pro",
    title: "Pro",
    price: "$349",
    features: [
      "Custom AI Insights",
      "Unlimited Uploads",
      "Dedicated 24/7 Support",
    ],
    color: "from-pink-400 to-pink-600",
  },
  {
    id: "ultimate",
    title: "Ultimate",
    price: "$499",
    features: [
      "Full AI Integration",
      "Unlimited Uploads",
      "Premium Support",
      "Custom Reports",
    ],
    color: "from-purple-400 to-purple-600",
  },
];

export default function Packages() {
  return (
    <section id="packages" className="py-16 scroll-mt-32">
      <h2 className="text-4xl font-bold text-center mb-8">Choose Your Plan</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-black bg-opacity-20 p-10 rounded-xl shadow-lg w-80 h-[28rem] transform transition-all`}
            style={{
              transition:
                "box-shadow 0.4s ease-in-out, transform 0.4s ease-in-out",
              border: `4px solid ${
                pkg.id === "lite"
                  ? "rgba(59, 130, 246, 0.5)" // Blue border
                  : pkg.id === "pro"
                  ? "rgba(236, 72, 153, 0.5)" // Pink border
                  : "rgba(168, 85, 247, 0.5)" // Purple border
              }`,
              cursor: "default", // Ensures the package itself is NOT clickable
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                pkg.id === "lite"
                  ? "0 0 20px rgba(59, 130, 246, 0.8)" // Blue glow
                  : pkg.id === "pro"
                  ? "0 0 20px rgba(236, 72, 153, 0.8)" // Pink glow
                  : "0 0 20px rgba(168, 85, 247, 0.8)"; // Purple glow
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Ribbon for Most Popular */}
            {pkg.id === "pro" && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-pink-700 text-white text-xs px-4 py-1 rounded-md uppercase font-bold shadow-md">
                Most Popular
              </div>
            )}

            {/* Package Title */}
            <h3 className="text-3xl font-extrabold text-white text-center mb-4">
              {pkg.title}
            </h3>

            {/* Price */}
            <p className="text-5xl font-bold text-white text-center mb-6">
              {pkg.price}
            </p>

            {/* Features List */}
            <ul className="text-white text-left space-y-4 mb-8">
              {pkg.features.map((feature, idx) => (
                <li
                  key={`${pkg.id}-${idx}`}
                  className="flex items-center gap-2"
                >
                  <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button Wrapped in Link to Ensure Only It is Clickable */}
            <Link href={`/${pkg.id}`}>
              <button
                className="block w-full py-3 rounded-lg font-semibold text-white  shadow-md"
                style={{
                  background:
                    pkg.id === "lite"
                      ? "linear-gradient(to right, #3b82f6, #2563eb)"
                      : pkg.id === "pro"
                      ? "linear-gradient(to right, #ec4899, #db2777)"
                      : "linear-gradient(to right, #a855f7, #9333ea)",
                  cursor: "pointer", // Only the button is clickable
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    pkg.id === "lite"
                      ? "#1d4ed8" // Darker blue on hover
                      : pkg.id === "pro"
                      ? "#be185d" // Darker pink on hover
                      : "#7c3aed"; // Darker purple on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    pkg.id === "lite"
                      ? "linear-gradient(to right, #3b82f6, #2563eb)"
                      : pkg.id === "pro"
                      ? "linear-gradient(to right, #ec4899, #db2777)"
                      : "linear-gradient(to right, #a855f7, #9333ea)";
                }}
              >
                Select {pkg.title}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
