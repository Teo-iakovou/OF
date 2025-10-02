"use client";
import Reveal from "@/app/components/common/Reveal";

export default function FeatureComparison() {
  return (
    <Reveal as="section" id="features" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-gray-800 border border-gray-700 text-center">
            <thead>
              <tr className="bg-gray-700 text-pink-400 text-lg">
                <th className="p-4">Feature</th>
                <th className="p-4">Lite</th>
                <th className="p-4">Pro</th>
                <th className="p-4">Ultimate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-700">
                <td className="p-4">AI Recommendations</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-4">Platform Suggestion</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
              </tr>
              <tr className="border-t border-gray-700">
                <td className="p-4">Upload Limit</td>
                <td className="p-4">10</td>
                <td className="p-4">50</td>
                <td className="p-4">Unlimited</td>
              </tr>
              {/* Add more features here */}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}
