import { useState } from "react";
import i18n from "../../lib/i18nextHandlers";

const LANGUAGES = {
  es: { code: "es", label: "ES", flag: "🇪🇸" },
  en: { code: "en", label: "EN", flag: "🇬🇧" },
};

export default function LanguageToggleButton() {
  const [open, setOpen] = useState(false);
  const currentLang = i18n.language.startsWith("en") ? "en" : "es";

  const changeLanguage = (lang: "es" | "en") => {
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Botón principal con bandera y código */}
      <button
        onClick={() => setOpen(!open)}
        className="hover:bg-background-light-grey text-text-body rounded-full px-3 py-2 flex items-center gap-2"
      >
        <span className="text-xl">{LANGUAGES[currentLang].flag}</span>
        <span className="font-medium">{LANGUAGES[currentLang].label}</span>
      </button>

      {/* Desplegable */}
      {open && (
        <div className="absolute right-0 mt-2 w-22 rounded border bg-white shadow-md z-10">
          {(Object.keys(LANGUAGES) as Array<"es" | "en">).map((key) => (
            <button
              key={key}
              onClick={() => changeLanguage(key)}
              className={`flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 ${
                currentLang === key ? "font-bold bg-gray-100" : ""
              }`}
            >
              <span className="text-xl">{LANGUAGES[key].flag}</span>
              <span className="font-medium">{LANGUAGES[key].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}