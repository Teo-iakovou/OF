"use client";

import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";

export default function TipsCard() {
  const t = useTranslations("dashboard.tips");
  const tips = t.raw("items") as string[];
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">{t("heading")}</h2>
      </div>
      <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
