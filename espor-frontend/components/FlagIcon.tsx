import type { Language } from "@/i18n";

const FLAG_CODES: Record<Language, string> = {
  en: "gb",
  tr: "tr",
  ru: "ru",
};

export default function FlagIcon({ language, className = "w-4 h-3" }: { language: Language; className?: string }) {
  const code = FLAG_CODES[language];
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      aria-hidden="true"
      className={`inline-block shrink-0 rounded-[2px] object-cover shadow-sm ${className}`}
      loading="lazy"
    />
  );
}
