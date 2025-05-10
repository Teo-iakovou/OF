"use client";
import { FC } from "react";

interface InsightsProps {
  insights: {
    platform: string;
    bestPostTime: string;
    aiCaption?: string;
    tip?: string;
    hashtags?: string[];
    objects?: string[];
    emotion?: string;
    dominantColors?: string[];
  };
}

const Insights: FC<InsightsProps> = ({ insights }) => {
  if (!insights) return null;

  const sections = [
    {
      label: "📱 Best Platform",
      value: insights.platform,
      className: "text-green-400",
    },
    {
      label: "🕒 Best Time to Post",
      value: insights.bestPostTime,
      className: "text-yellow-400",
    },
    {
      label: "🎭 Emotion",
      value: insights.emotion,
      className: "text-pink-400",
    },
    {
      label: "🎨 Dominant Colors",
      value: insights.dominantColors?.join(", "),
      className: "text-blue-400",
    },
    {
      label: "💡 Tip",
      value: insights.tip,
      className: "text-purple-400",
    },
    {
      label: "✍️ AI Caption",
      value: `"${insights.aiCaption}"`,
      className: "italic text-purple-300",
    },
  ];

  return (
    <div className="mt-8 p-6 sm:p-4 bg-gray-900 text-white shadow-lg rounded-lg space-y-6 w-full">
      <h2 className="text-2xl sm:text-xl font-bold text-pink-400 mb-4 text-center">
        📊 Your AI Insights
      </h2>

      <div className="space-y-5 sm:space-y-4">
        {sections.map(
          (sec, idx) =>
            sec.value && (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-800 p-4 rounded-lg"
              >
                <h3 className="text-sm sm:text-base font-semibold text-gray-300">
                  {sec.label}
                </h3>
                <p
                  className={`text-right mt-1 sm:mt-0 sm:ml-4 ${sec.className}`}
                >
                  {sec.value}
                </p>
              </div>
            )
        )}

        {insights.hashtags?.length ? (
          <div>
            <h3 className="text-lg font-semibold mb-1">🏷️ Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {insights.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs hover:bg-purple-600 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {insights.objects?.length ? (
          <div>
            <h3 className="text-lg font-semibold mb-1">🧠 Detected Objects</h3>
            <ul className="list-disc pl-6 text-sm text-gray-300 space-y-1">
              {insights.objects.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Insights;
