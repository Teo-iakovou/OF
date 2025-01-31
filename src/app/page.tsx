"use client";

import Link from "next/link";

export default function Page() {
  const packages = [
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

  return (
    <>
      {/* Page Layout */}
      <div className="bg-of-background text-white min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="text-center py-32 bg-gradient-to-r from-pink-500 to-purple-600">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            AI Content Helper
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Analyze your content and unlock valuable insights for your platform.
          </p>
          <button className="bg-white text-black font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100">
            Get Started
          </button>
        </div>

        {/* Packages Section */}
        <main className="container mx-auto px-6 flex-1">
          <section className="py-16">
            <h2 className="text-4xl font-bold text-center mb-8">
              Choose Your Plan
            </h2>
            <div className="flex flex-wrap justify-center gap-8 py-12">
              {packages.map((pkg) => (
                <Link href={`/packages/${pkg.id}`} key={pkg.id}>
                  <div
                    className={`relative bg-gradient-to-r ${pkg.color} p-8 rounded-xl shadow-lg w-96 transform hover:scale-105 transition-transform cursor-pointer`}
                  >
                    {/* Ribbon for Most Popular */}
                    {pkg.id === "pro" && (
                      <div className="absolute top-0 right-0 bg-pink-700 text-white text-xs px-3 py-1 rounded-bl-md uppercase font-bold shadow-md">
                        Most Popular
                      </div>
                    )}

                    <h3 className="text-3xl font-extrabold text-white text-center mb-4">
                      {pkg.title}
                    </h3>
                    <p className="text-5xl font-bold text-white text-center mb-6">
                      {pkg.price}
                    </p>
                    <ul className="text-white text-left space-y-4 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="block w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all shadow-md">
                      Select {pkg.title}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
