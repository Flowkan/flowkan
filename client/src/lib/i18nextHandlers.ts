import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../locales/en.json";
import es from "../locales/es.json";

const resources = {
	func: {
		list: ["i18next.t", "i18n.t", "t", "__"],
		extensions: [".ts", ".tsx"],
	},
	en: { translation: en },
	es: { translation: es },
};

i18n
	.use(LanguageDetector)
	.use(initReactI18next)

	.init({
		resources,
		fallbackLng: "es",
		supportedLngs: ["es", "en"],
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: [
				"localStorage",
				"cookie",
				"navigator",
				"sessionStorage",
				"querystring",
			],
			caches: ["localStorage"],
		},
	});

export default i18n;
