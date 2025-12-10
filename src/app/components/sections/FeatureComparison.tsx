"use client";
import Reveal from "@/app/components/common/Reveal";

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
    <Reveal as="section" id="features" className="py-16 text-white">
      <div className="space-y-8 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">Capability matrix</p>
        <h2 className="text-4xl font-bold">Compare the experience</h2>
        <p className="text-lg text-white/70 max-w-3xl mx-auto">
          Every tier taps the same neural engine. Higher plans unlock more speed, depth, and bespoke workflows for
          SadTalker and marketing intelligence.
        </p>
      </div>
      <div className="mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-white/5 backdrop-blur theme-shadow">
        <table className="w-full table-fixed border-separate border-spacing-y-3 px-4 py-6">
          <thead>
            <tr className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
              <th className="w-2/5 py-3 pl-4 text-left text-white/60">Feature</th>
              <th className="w-1/5 py-3 text-center">Lite</th>
              <th className="w-1/5 py-3 text-center">Pro</th>
              <th className="w-1/5 py-3 pr-4 text-center">Ultimate</th>
            </tr>
          </thead>
          <tbody>
            {features.map((row) => (
              <tr
                key={row.label}
                className="text-base text-white/90 shadow-[0_15px_50px_rgba(18,43,102,0.35)] bg-gradient-to-r from-[#111a3a]/70 via-[#0d1328]/80 to-[#0a0f1c]/80"
              >
                <td className="w-2/5 py-4 pl-4 text-left font-semibold">{row.label}</td>
                <td className="w-1/5 py-4 text-center text-cyan-200">{row.lite}</td>
                <td className="w-1/5 py-4 text-center text-fuchsia-200">{row.pro}</td>
                <td className="w-1/5 py-4 pr-4 text-center text-emerald-200">{row.ultimate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
