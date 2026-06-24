import type { Language } from "./index";

export const LOCALE_MAP: Record<Language, string> = {
  en: "en-US",
  tr: "tr-TR",
  ru: "ru-RU",
};

export function formatTranslation(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template
  );
}
