import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

localStorage.setItem("i18nextLng", "en");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },
  });

export default i18n;
