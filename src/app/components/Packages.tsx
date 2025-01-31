import React from "react";
import Link from "next/link";

const Packages = () => {
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
    <section className="py-16 bg-of-background">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">
        Choose Your Plan
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <Link href={`/packages/${pkg.id}`} key={pkg.id}>
            <div
              className={`bg-gradient-to-r ${pkg.color} p-8 rounded-lg shadow-lg w-80 transform hover:scale-105 transition-transform cursor-pointer`}
            >
              <h3 className="text-2xl font-bold text-white text-center mb-4">
                {pkg.title}
              </h3>
              <p className="text-4xl font-bold text-white text-center mb-6">
                {pkg.price}
              </p>
              <ul className="text-white text-left space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="block w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Get Started
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Packages;
