"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  translations,
  detectBrowserLanguage,
  getApiTermDictionary,
  isValidLanguage,
  type Language,
  type TranslationKeys,
  type Translations,
} from "@/i18n";

export type { Language, TranslationKeys, Translations };
export { translations, LANGUAGES } from "@/i18n";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  translateApiText: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
  translateApiText: (text) => text,
});

const STORAGE_KEY = "nexus-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && isValidLanguage(savedLang)) {
      setLanguageState(savedLang);
    } else {
      setLanguageState(detectBrowserLanguage());
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const translateApiText = useCallback(
    (text: string | undefined) => {
      if (!text) return "";
      const dictionary = getApiTermDictionary(language);
      if (!dictionary) return text;

      if (dictionary[text]) return dictionary[text];

      let translatedText = text;
      const terms = Object.keys(dictionary).sort((a, b) => b.length - a.length);
      terms.forEach((term) => {
        const regex = new RegExp(`\\b${term}\\b`, "gi");
        translatedText = translatedText.replace(regex, dictionary[term]);
      });
      return translatedText;
    },
    [language]
  );

  if (!mounted) return <div style={{ visibility: "hidden" }}>{children}</div>;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], translateApiText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
