import en from "./locales/en";
import tr from "./locales/tr";
import ru from "./locales/ru";
import trApiTerms from "./apiTerms/tr";
import ruApiTerms from "./apiTerms/ru";

export type Language = "en" | "tr" | "ru";

export type TranslationKeys = keyof typeof en;
export type Translations = Record<TranslationKeys, string>;

export const translations: Record<Language, Translations> = { en, tr, ru };

export const LANGUAGES: { id: Language; label: string; nativeName: string }[] = [
  { id: "en", label: "EN", nativeName: "English" },
  { id: "tr", label: "TR", nativeName: "Türkçe" },
  { id: "ru", label: "RU", nativeName: "Русский" },
];

const apiTermDictionaries: Partial<Record<Language, Record<string, string>>> = {
  tr: trApiTerms,
  ru: ruApiTerms,
};

export function getApiTermDictionary(language: Language): Record<string, string> | null {
  return apiTermDictionaries[language] ?? null;
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("tr")) return "tr";
  if (browserLang.startsWith("ru")) return "ru";
  return "en";
}

export function isValidLanguage(value: string): value is Language {
  return LANGUAGES.some((lang) => lang.id === value);
}

export { en, tr, ru };
export { LOCALE_MAP, formatTranslation } from "./helpers";
