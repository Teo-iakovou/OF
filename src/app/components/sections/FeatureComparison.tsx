"use client";
import SectionReveal from "@/app/components/common/SectionReveal";

const features = [
  { label: "AI Recommendations", lite: "Included", pro: "Advanced", ultimate: "Adaptive" },
  { label: "Platform Suggestions", lite: "Social Core", pro: "Multi-channel", ultimate: "Omnichannel" },
  { label: "Upload Limit", lite: "10 / day", pro: "50 / day", ultimate: "Unlimited" },
  { label: "SadTalker Render Time", lite: "Standard queue", pro: "Priority", ultimate: "Real-time" },
  { label: "Avatar Library", lite: "Starter pack", pro: "Premium pack", ultimate: "Custom avatars" },
  { label: "Support", lite: "Email", pro: "24/7 concierge", ultimate: "Dedicated AI coach" },
];

export default function FeatureComparison() {
  return (
    <SectionReveal as="section" id="features" className="py-16 text-white">
      <div className="space-y-8 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--hg-accent)]/80">Capability matrix</p>
        <h2 className="text-4xl font-bold">Compare the experience</h2>
        <p className="text-lg text-[var(--hg-muted)] max-w-3xl mx-auto">
          Every tier taps the same neural engine. Higher plans unlock more speed, depth, and bespoke workflows for
          SadTalker and marketing intelligence.
        </p>
      </div>
      <div className="mt-12 overflow-x-auto rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] backdrop-blur theme-shadow">
        <table className="w-full table-fixed border-separate border-spacing-y-3 px-4 py-6">
          <thead>
            <tr className="text-sm uppercase tracking-[0.3em] text-[var(--hg-accent)]/80">
              <th className="w-2/5 py-3 pl-4 text-left text-[var(--hg-muted-2)]">Feature</th>
              <th className="w-1/5 py-3 text-center">Lite</th>
              <th className="w-1/5 py-3 text-center">Pro</th>
              <th className="w-1/5 py-3 pr-4 text-center">Ultimate</th>
            </tr>
          </thead>
          <tbody>
            {features.map((row) => (
              <tr
                key={row.label}
                className="text-base text-[var(--hg-text)] shadow-[0_8px_24px_rgba(2,6,14,0.25)] bg-[var(--hg-surface)]"
              >
                <td className="w-2/5 py-4 pl-4 text-left font-semibold">{row.label}</td>
                <td className="w-1/5 py-4 text-center text-[var(--hg-accent)]">{row.lite}</td>
                <td className="w-1/5 py-4 text-center text-[#50C0F0]">{row.pro}</td>
                <td className="w-1/5 py-4 pr-4 text-center text-[#7dd4fb]">{row.ultimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionReveal>
  );
}
