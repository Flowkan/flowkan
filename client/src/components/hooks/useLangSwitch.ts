import { useMemo, useState } from "react";
import i18n from "../../lib/i18nextHandlers";

export type LanguageCode = "es" | "en"

export type Language = {
	code: LanguageCode;
	label: string;
	flag: string;
};
export type LangSwitchReturn = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	changeLanguage: (lang: "es" | "en") => void;
	LANGUAGES: Language[];
	selectedLanguage?: Language;
	selectedLangCode: LanguageCode;
};

export const LangSwitch = (): LangSwitchReturn => {
	const LANGUAGES: Language[] = [
		{ code: "es", label: "ES", flag: "/flags/ES_flag.png" },
		{ code: "en", label: "EN", flag: "/flags/EN_flag.png" },
	];
	const [open, setOpen] = useState(false);
  const [selectedLangCode, setSelectedLangCode] = useState<LanguageCode>(i18n.language.startsWith("es") ? "es" : "en");

	const changeLanguage = (lang: LanguageCode) => {
		i18n.changeLanguage(lang);
    setSelectedLangCode(lang)
		setOpen(false);
	};

	const selectedLanguage = useMemo(
		() => LANGUAGES.find((l) => l.code === selectedLangCode),
		[selectedLangCode],
	);
	return {
		open,
		setOpen,
		changeLanguage,
		LANGUAGES,
		selectedLanguage,
		selectedLangCode,
	};
};
