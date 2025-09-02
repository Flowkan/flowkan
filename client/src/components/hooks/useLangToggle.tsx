import { Button } from "../ui/Button";
import { LangSwitch } from "../ui/LangSwitch";

export default function LanguageToggleButton() {
	const {
		open,
		setOpen,
		LANGUAGES,
		changeLanguage,
		selectedLanguage,
		selectedLangCode,
	} = LangSwitch();

	return (
		<div className="relative">
			<Button
				onClick={() => setOpen(!open)}
				aria-expanded={open}
				className="hover:bg-background-light-grey text-text-body flex items-center gap-2 rounded-full px-3 py-2"
			>
				{selectedLanguage && (
					<>
						<span className="text-xl">
							<img
								src={selectedLanguage.flag}
								alt={`Bandera de ${selectedLanguage.label}`}
								width={32}
							/>
						</span>
						<span className="font-medium">{selectedLanguage.label}</span>
					</>
				)}
			</Button>

			{open && (
				<div className="absolute right-0 z-10 mt-2 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
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
								<span className="text-xl">
									<img src={flag} alt={`Bandera de ${label}`} width={32} />
								</span>
								<span>{label}</span>
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
}
