const LOCALE_LANGUAGE_MAP = {
  en: "English",
  el: "Greek (Ελληνικά)",
  es: "Spanish (Español)",
  it: "Italian (Italiano)",
};

const SUPPORTED_LOCALES = Object.keys(LOCALE_LANGUAGE_MAP);

function resolveLanguageName(locale) {
  if (typeof locale !== "string") return "English";
  const normalized = locale.toLowerCase().slice(0, 2);
  return LOCALE_LANGUAGE_MAP[normalized] || "English";
}

function isValidLocale(locale) {
  if (typeof locale !== "string") return false;
  return SUPPORTED_LOCALES.includes(locale.toLowerCase().slice(0, 2));
}

module.exports = { resolveLanguageName, isValidLocale, SUPPORTED_LOCALES };
