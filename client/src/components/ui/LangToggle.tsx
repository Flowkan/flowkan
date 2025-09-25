import { Button } from "./Button";
import { LangSwitch } from "../../hooks/useLangSwitch";
import { useDismiss } from "../../hooks/useDismissClickAndEsc";

export default function LanguageToggleButton() {
	const { LANGUAGES, changeLanguage, selectedLanguage, selectedLangCode } =
		LangSwitch();
	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();

	return (
		<div className="relative" ref={ref}>
			<Button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="hover:bg-background-light-grey text-text-body flex items-center gap-2 rounded-full px-3 py-2"
			>
				{selectedLanguage && (
					<img
						src={selectedLanguage.flag}
						alt={`Bandera de ${selectedLanguage.label}`}
						width={32}
						aria-label={`Bandera de ${selectedLanguage.label}`}
						title={`Bandera de ${selectedLanguage.label}`}
					/>
				)}
			</Button>

			{open && (
				<div className="absolute right-0 z-10 mt-2 w-35 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
					{LANGUAGES.map(({ code, flag, label }) => {
						const isActive = selectedLangCode === code;
						return (
							<Button
								key={code}
								onClick={() => changeLanguage(code)}
								className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-150 hover:bg-gray-100 ${
									isActive ? "bg-gray-200 font-semibold" : ""
								}`}
							>
								<span className="flex items-center gap-2">
									<img
										src={flag}
										alt={`Bandera de ${label}`}
										width={24}
										className="shrink-0"
									/>
								</span>
								<span className="text-sm">{label}</span>
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
}
