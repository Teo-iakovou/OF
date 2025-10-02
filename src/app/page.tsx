"use client";
import Packages from "@/app/components/packages/Packages"; // Assuming you have a Packages component
import FeatureComparison from "./components/sections/FeatureComparison";
import ScrollToTop from "./components/features/ScrollToTop";
import FeedbackWidget from "./components/features/FeedbackWidget";
import Reveal from "@/app/components/common/Reveal";

export default function Page() {
  return (
    <>
      {/* Page Layout */}
      <div className="bg-gray-900 text-white min-h-screen flex flex-col">
        {/* Hero Section */}
        <Reveal as="div" className="text-center py-32 bg-gradient-to-r from-pink-500 to-purple-600">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            AI Content Helper
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Analyze your content and unlock valuable insights for your platform.
          </p>
          <button className="bg-white text-black font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-100">
            Get Started
          </button>
        </Reveal>

        {/* Packages Section */}
        <main className="container mx-auto px-6 flex-1">
          <Reveal as="section" className="py-16">
            {/* Use the Packages component to display plans */}
            <Packages />
          </Reveal>
        </main>

        {/* Feature Comparison Section */}
        <Reveal as="div">
          <FeatureComparison />
        </Reveal>

        {/* Scroll to Top Button */}
        <ScrollToTop />

        {/* Feedback Widget */}
        <FeedbackWidget />
      </div>
    </>
  );
}
