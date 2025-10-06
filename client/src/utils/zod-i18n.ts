import i18next from "i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

import es from "../locales/es.json";
import en from "../locales/en.json";

i18next.init({
	lng: "es",
	fallbackLng: "en",
	resources: {
		es: es,
		en: en,
	},
});

z.setErrorMap(zodI18nMap);
export { z };
