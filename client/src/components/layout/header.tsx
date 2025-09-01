import { useState } from "react";
import { useAppSelector } from "../../store";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../hooks/useLangToggle";

export const Header: React.FC = () => {
	const { t } = useTranslation();
	const auth = useAppSelector((state) => state.auth);
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => setMenuOpen((prev) => !prev);
	const baseUrl = import.meta.env.VITE_BASE_DEV_URL;

	return (
		<header className="bg-background-card flex items-center justify-between px-6 py-4 shadow-sm md:px-12">
			<div className="flex items-center space-x-8">{/* Logo */}</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-3">
					<LanguageToggle />
				</div>

				<div className="relative">
					{auth.isLogged && auth.user ? (
						<>
							<button
								className="flex items-center rounded-full focus:outline-none"
								onClick={toggleMenu}
							>
								<img
									src={
										auth.user.photo
											? `${baseUrl}${auth.user.photo}`
											: "/default-avatar.png"
									}
									alt={auth.user.name}
									className="h-10 w-10 rounded-full object-cover"
								/>
							</button>

							{menuOpen && (
								<div className="ring-opacity-5 absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black">
									<NavLink
										to="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										{t("header.menu.profile", "Perfil")}
									</NavLink>
									<NavLink
										to="/settings"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										{t("header.menu.settings", "Ajustes")}
									</NavLink>
									<button
										onClick={() => {
											// dispatch logout
										}}
										className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									>
										{t("header.menu.logout", "Cerrar sesión")}
									</button>
								</div>
							)}
						</>
					) : (
						<div className="flex space-x-2">
							<NavLink to="/login" className="...">
								{t("header.login", "Login")}
							</NavLink>
							<NavLink to="/register" className="...">
								{t("header.signup", "Registro")}
							</NavLink>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
