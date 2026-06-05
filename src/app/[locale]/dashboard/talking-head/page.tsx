"use client";

import { useTranslations } from "next-intl";
import UploadTalkingHead from "@/app/components/render/UploadTalkingHead";
import SpotlightTour from "@/app/components/onboarding/SpotlightTour";
import { useTour } from "@/app/components/onboarding/useTour";

const AVT_TOUR_STEPS = [
  { target: "avt-heading",  titleKey: "step1.title", bodyKey: "step1.body", placement: "bottom" as const },
  { target: "avt-image",    titleKey: "step2.title", bodyKey: "step2.body", placement: "bottom" as const },
  { target: "avt-audio",    titleKey: "step3.title", bodyKey: "step3.body", placement: "bottom" as const },
  { target: "avt-generate", titleKey: "step4.title", bodyKey: "step4.body", placement: "top"    as const },
  { target: "avt-history",  titleKey: "step5.title", bodyKey: "step5.body", placement: "top"    as const },
];

export default function TalkingHeadPage() {
  const t = useTranslations("dashboard.talkingHeadPage");
  const { isDone: tourDone, markDone: markTourDone } = useTour("avt");

  return (
    <div className="dashboard-mobile-page relative text-white">
      <div className="dashboard-mobile-container mx-auto w-full max-w-5xl px-4 pb-16 pt-3 md:px-8 md:pt-16">
        <header className="mx-auto max-w-3xl text-center">
          <h1 data-tour="avt-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">{t("heading")}</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">
            {t("subtitle")}
          </p>
        </header>

        <main className="mt-8 md:mt-10">
          <UploadTalkingHead />
        </main>
      </div>
      {tourDone === false && (
        <SpotlightTour
          tourId="avt"
          i18nNamespace="dashboard.talkingHeadPage.tour"
          steps={AVT_TOUR_STEPS}
          onComplete={markTourDone}
        />
      )}
    </div>
  );
}
