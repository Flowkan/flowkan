import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import es from "../locales/es.json";

const resources = {
	en: { translation: en },
	es: { translation: es },
};

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources,
		lng: "es",
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ["localStorage", "navigator", "htmlTag"],
			caches: ["localStorage"],
		},
	});

export default i18n;
