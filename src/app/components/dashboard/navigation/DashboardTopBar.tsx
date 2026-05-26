"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import { DASHBOARD_LAYOUT } from "@/app/dashboard/dashboardLayout.constants";
import LocaleSwitcher from "@/app/components/common/LocaleSwitcher";
import { FeedbackWidget } from "@/app/components/features/FeedbackWidget";

type Props = {
  onOpenSettings: () => void;
};

export default function DashboardTopBar({ onOpenSettings }: Props) {
  const t = useTranslations("dashboard.topBar");
  return (
    <div className={`md:hidden fixed left-0 right-0 ${DASHBOARD_LAYOUT.mobileTopBarTopOffset} z-40 flex justify-center`}>
      <div className="w-full max-w-6xl bg-[color:color-mix(in_oklab,white_3%,transparent)] backdrop-blur-[2px]">
        <div className="mx-auto relative flex h-[calc(env(safe-area-inset-top,0px)+3.8rem)] w-full items-end justify-between px-4 pb-2">

          {/* Left: Settings */}
          <button
            aria-label={t("openSettingsLabel")}
            onClick={onOpenSettings}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <Settings size={18} />
          </button>

          {/* Center: Logo — absolutely positioned so it's always centered */}
          <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
            <Image
              src="/echofy-removebg-preview.png"
              alt="echo‑fy"
              width={28}
              height={28}
              className="h-7 w-auto rounded-full"
            />
          </div>

          {/* Right: Feedback + Language switcher */}
          <div className="flex items-center gap-1">
            <FeedbackWidget variant="icon" />
            <LocaleSwitcher variant="compact" />
          </div>

        </div>
      </div>
    </div>
  );
}
