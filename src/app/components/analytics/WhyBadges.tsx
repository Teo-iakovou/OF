//unused file !!! 
"use client";

export default function WhyBadges({
  csl,
  niche,
  hasFace,
}: {
  csl?: number;
  niche?: string;
  hasFace?: boolean;
}) {
  const items: string[] = [];
  if (typeof csl === "number") {
    items.push(csl >= 2 ? "SFW only on IG/TikTok" : "SFW OK");
    items.push(`CSL ${csl}/3`);
  }
  if (niche) items.push(`Niche: ${niche}`);
  if (hasFace) items.push("Face detected");

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x, i) => (
        <span
          key={i}
          className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-200 border border-gray-700"
        >
          {x}
        </span>
      ))}
    </div>
  );
}
