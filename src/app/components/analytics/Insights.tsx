"use client";
import { FC } from "react";

interface InsightsProps {
  insights: {
    platform: string;
    bestPostTime: string;
    recommendations?: string[];
    hashtags?: string[];
    objects?: string[];
  };
}

const Insights: FC<InsightsProps> = ({ insights }) => {
  if (!insights || !insights.objects) return null;

  return (
    <div className="mt-8 p-6 bg-gray-900 text-white shadow-lg rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        📊 Your AI Insights
      </h2>

      {/* Platform */}
      <div>
        <h3 className="text-lg font-semibold mb-1">📱 Best Platform</h3>
        <p className="text-gray-300">{insights.platform}</p>
      </div>

      {/* Best Time */}
      <div>
        <h3 className="text-lg font-semibold mb-1">🕒 Best Time to Post</h3>
        <p className="text-gray-300">{insights.bestPostTime}</p>
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">💡 AI Recommendations</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            {insights.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Hashtags */}
      {insights.hashtags && insights.hashtags.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">🏷️ Hashtags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {insights.hashtags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-600 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Objects */}
      {insights.objects?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-1">🧠 Detected Objects</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-1">
            {insights.objects.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Insights;
