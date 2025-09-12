import { NavLink } from "react-router-dom";
import LanguageToggle from "../hooks/useLangToggle";
import { useAppSelector } from "../../store";
import { useTranslation } from "react-i18next";
import { UserMenu } from "../hooks/useUserMenu";

export const BackofficeHeader: React.FC = () => {
	const baseUrl = import.meta.env.VITE_BASE_DEV_URL;
	const { user } = useAppSelector((state) => state.auth);
	const { t } = useTranslation();

	return (
		<header className="flex w-full items-center justify-between bg-gray-800 px-6 py-4 text-white shadow-md">
			{/* Solo un título, con SVG y texto */}
			<NavLink to="/">
				<div className="flex items-center space-x-2">
					<svg
						className="text-accent h-6 w-6"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm4 0a1 1 010-2 0v4a1 1 0102 0V6z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="text-2xl font-bold text-shadow-red-50">
						{t("backoffice.title", "Backoffice")}
					</span>
				</div>
			</NavLink>

			<div className="flex items-center space-x-4">
				<LanguageToggle />

				<UserMenu user={user} baseUrl={baseUrl} avatarSize={40} />
			</div>
		</header>
	);
};
