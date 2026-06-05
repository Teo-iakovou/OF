import LandingPage from "./LandingPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  await params; // Locale is handled by next-intl middleware/layout.
  return <LandingPage />;
}

// Hint Next.js that this page can be statically generated per locale.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "el" }, { locale: "es" }, { locale: "it" }];
}
