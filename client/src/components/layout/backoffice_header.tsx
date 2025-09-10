import { useState } from "react";
import { NavLink } from "react-router-dom";
import LanguageToggle from "../hooks/useLangToggle";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { logout } from "../../store/authSlice";

export const BackofficeHeader: React.FC = () => {
	const { t } = useTranslation();
	const baseUrl = import.meta.env.VITE_BASE_DEV_URL;
	const [menuOpen, setMenuOpen] = useState(false);
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

	const toggleMenu = () => setMenuOpen((prev) => !prev);

	return (
		<header className="flex w-full items-center justify-between bg-gray-800 px-6 py-4 text-white shadow-md">
			<NavLink to="/backoffice">
				<h1 className="text-xl font-bold">Backoffice</h1>
			</NavLink>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-3">
					<LanguageToggle />
				</div>

				<div className="relative">
					<div>
						<button
							className="flex items-center rounded-full focus:outline-none"
							onClick={toggleMenu}
						>
							<img
								src={
									user?.photo
										? `${baseUrl}${user.photo}`
										: "/default-avatar.png"
								}
								alt={user?.name}
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
									to="/boards"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									{t("header.menu.boards", "Mis tableros")}
								</NavLink>
								<button
									onClick={() => dispatch(logout())}
									className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								>
									{t("header.menu.logout", "Cerrar sesión")}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
