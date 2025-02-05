const Insights = ({ insights }: { insights: any }) => {
  if (!insights || !insights.objects) return null; // Prevents crashes if insights are missing

  return (
    <div className="mt-8 p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-purple-500 mb-6">
        Your AI Insights
      </h2>

      {/* Dominant Color */}
      {insights.dominantColor ? (
        <div className="mb-4 flex items-center">
          <strong className="text-lg">Dominant Color:</strong>
          <span
            style={{
              display: "inline-block",
              width: "24px",
              height: "24px",
              backgroundColor: insights.dominantColor,
              marginLeft: "10px",
              borderRadius: "50%",
              border: "2px solid #fff",
            }}
          ></span>
        </div>
      ) : (
        <div className="mb-4 text-gray-400">No dominant color detected.</div>
      )}

      {/* Best Platform */}
      {insights.platform ? (
        <div className="mb-4">
          <strong className="text-lg">Best Platform:</strong>{" "}
          <span className="text-gray-200">{insights.platform}</span>
        </div>
      ) : (
        <div className="mb-4 text-gray-400">
          No platform recommendation available.
        </div>
      )}

      {/* Hashtags */}
      {insights.hashtags && insights.hashtags.length > 0 ? (
        <div className="mb-4">
          <strong className="text-lg">Hashtags:</strong>{" "}
          <span className="text-gray-200">{insights.hashtags.join(", ")}</span>
        </div>
      ) : (
        <div className="mb-4 text-gray-400">No hashtags available.</div>
      )}

      {/* Best Post Time */}
      {insights.bestPostTime ? (
        <div className="mb-4">
          <strong className="text-lg">Best Post Time:</strong>{" "}
          <span className="text-gray-200">{insights.bestPostTime}</span>
        </div>
      ) : (
        <div className="mb-4 text-gray-400">No best post time detected.</div>
      )}

      {/* Objects Detected */}
      {insights.objects.length > 0 ? (
        <div>
          <strong className="text-lg">Objects Detected:</strong>
          <ul className="list-disc pl-5 text-gray-200 mt-2 space-y-1">
            {insights.objects.map((object: string, index: number) => (
              <li key={index} className="hover:text-purple-400">
                {object}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4 text-gray-400">No objects detected.</div>
      )}
    </div>
  );
};

export default Insights;
