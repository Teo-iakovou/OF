const Analytics = ({ history }: { history: any[] }) => {
  const totalUploads = history.length;

  // Count occurrences of platforms
  const platformCounts: Record<string, number> = history.reduce(
    (acc: Record<string, number>, item: any) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    },
    {}
  );

  // Get the most analyzed platform
  const mostCommonPlatform = Object.keys(platformCounts).reduce((a, b) =>
    platformCounts[a] > platformCounts[b] ? a : b
  );

  // Count occurrences of hashtags
  const mostCommonHashtags: Record<string, number> = history
    .flatMap((item: any) => item.hashtags)
    .reduce((acc: Record<string, number>, hashtag: string) => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
      return acc;
    }, {});

  // Sort hashtags by count and get the top 5
  const topHashtags = Object.entries(mostCommonHashtags)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([hashtag]) => hashtag);

  return (
    <div className="mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
      <p>Total Uploads: {totalUploads}</p>
      <p>Most Analyzed Platform: {mostCommonPlatform}</p>
      <p>Most Common Hashtags: {topHashtags.join(", ")}</p>
    </div>
  );
};

export default Analytics;
