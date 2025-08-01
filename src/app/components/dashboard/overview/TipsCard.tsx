"use client";

import { Lightbulb } from "lucide-react";

const tips = [
  "Upload high-quality vertical images for better analysis.",
  "Use the AI Chat to refine your captions or test ideas.",
  "Check your Insight History to see what performed well.",
  "Use hashtags suggested by the AI for better reach.",
  "Schedule uploads at peak times (e.g., 6–9 PM local time)."
];

export default function TipsCard() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Tips for Best Results</h2>
      </div>
      <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
