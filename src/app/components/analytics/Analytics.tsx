// const Analytics = ({ history }: { history: any[] }) => {
//   const totalUploads = history.length;

//   // Count occurrences of platforms
//   const platformCounts: Record<string, number> = history.reduce(
//     (acc: Record<string, number>, item: any) => {
//       acc[item.platform] = (acc[item.platform] || 0) + 1;
//       return acc;
//     },
//     {}
//   );

//   // Get the most analyzed platform
//   const mostCommonPlatform = Object.keys(platformCounts).reduce((a, b) =>
//     platformCounts[a] > platformCounts[b] ? a : b
//   );

//   // Count occurrences of hashtags
//   const mostCommonHashtags: Record<string, number> = history
//     .flatMap((item: any) => item.hashtags)
//     .reduce((acc: Record<string, number>, hashtag: string) => {
//       acc[hashtag] = (acc[hashtag] || 0) + 1;
//       return acc;
//     }, {});

//   // Sort hashtags by count and get the top 5
//   const topHashtags = Object.entries(mostCommonHashtags)
//     .sort(([, a], [, b]) => (b as number) - (a as number))
//     .slice(0, 5)
//     .map(([hashtag]) => hashtag);

//   return (
//     <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg shadow-lg">
//       <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
//         Analytics Overview
//       </h2>
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <span className="text-lg font-medium">Total Uploads:</span>
//           <span className="text-xl font-bold text-pink-400">
//             {totalUploads}
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-lg font-medium">Most Analyzed Platform:</span>
//           <span className="text-xl font-bold text-purple-400">
//             {mostCommonPlatform || "N/A"}
//           </span>
//         </div>
//         <div className="space-y-2">
//           <p className="text-lg font-medium">Top Hashtags:</p>
//           <ul className="list-disc list-inside text-sm text-gray-300">
//             {topHashtags.length > 0
//               ? topHashtags.map((hashtag, index) => (
//                   <li key={index} className="text-blue-400">
//                     {hashtag}
//                   </li>
//                 ))
//               : "No hashtags available"}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;
