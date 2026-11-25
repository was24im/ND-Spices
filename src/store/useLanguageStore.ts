import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TRANSLATIONS, TranslationKeys } from "@/lib/translations";

export type Language = "en" | "hi";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language: Language) => set({ language }),
      toggleLanguage: () =>
        set({ language: get().language === "en" ? "hi" : "en" }),
    }),
    {
      name: "nd_spices_language_preference",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const isHindi = language === "hi";

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = TRANSLATIONS[language];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in Hindi
        let enCurrent: any = TRANSLATIONS.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === "object" && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback || path;
          }
        }
        return typeof enCurrent === "string" ? enCurrent : fallback || path;
      }
    }

    return typeof current === "string" ? current : fallback || path;
  };

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isHindi,
    dict: TRANSLATIONS[language],
  };
}
