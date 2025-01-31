const Insights = ({ insights }: { insights: any }) => {
  if (!insights || !insights.objects) return null; // ✅ Prevents crashes if insights are missing

  return (
    <div className="mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        AI Recommendations
      </h2>

      {/* ✅ Safe check for Dominant Color */}
      {insights.dominantColor ? (
        <div className="mb-4">
          <strong>Dominant Color:</strong>{" "}
          <span
            style={{
              display: "inline-block",
              width: "24px",
              height: "24px",
              backgroundColor: insights.dominantColor,
            }}
          ></span>
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No dominant color detected.</div>
      )}

      {/* ✅ Safe check for Platform */}
      {insights.platform ? (
        <div className="mb-4">
          <strong>Best Platform:</strong> {insights.platform}
        </div>
      ) : (
        <div className="mb-4 text-gray-500">
          No platform recommendation available.
        </div>
      )}

      {/* ✅ Safe check for Hashtags */}
      {insights.hashtags && insights.hashtags.length > 0 ? (
        <div className="mb-4">
          <strong>Hashtags:</strong> {insights.hashtags.join(", ")}
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No hashtags available.</div>
      )}

      {/* ✅ Safe check for Best Post Time */}
      {insights.bestPostTime ? (
        <div className="mb-4">
          <strong>Best Post Time:</strong> {insights.bestPostTime}
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No best post time detected.</div>
      )}

      {/* ✅ Objects Detected */}
      {insights.objects.length > 0 ? (
        <div>
          <strong>Objects Detected:</strong>
          <ul className="list-disc pl-5">
            {insights.objects.map((object: string, index: number) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-4 text-gray-500">No objects detected.</div>
      )}
    </div>
  );
};

export default Insights;
