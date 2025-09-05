import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../hooks/useLangToggle";
import { logout } from "../../store/authSlice";

export const Header: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { user, isAuthenticated } = useAppSelector((state) => state.auth);
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => setMenuOpen((prev) => !prev);
	const baseUrl = import.meta.env.VITE_BASE_DEV_URL;

	return (
		<header className="bg-background-card flex items-center justify-between px-6 py-4 shadow-sm md:px-12">
			<div className="flex items-center space-x-8">
				<NavLink to="/">
					<div className="flex items-center">
						<svg
							className="text-accent mr-2 h-6 w-6"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm4 0a1 1 010-2 0v4a1 1 0102 0V6z"
								clipRule="evenodd"
							></path>
						</svg>
						<span className="text-text-heading text-2xl font-bold">
							{t("header.title", "Flowkan")}
						</span>
					</div>
				</NavLink>

				<nav className="text-text-body hidden space-x-6 md:flex">
					<a href="#" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.features", "Características")}
					</a>
					<a href="#" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.solutions", "Soluciones")}
					</a>
					<a href="#" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.prices", "Precios")}
					</a>
				</nav>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-3">
					<LanguageToggle />
				</div>

				<div className="relative">
					{isAuthenticated && user ? (
						<>
							<button
								className="flex items-center rounded-full focus:outline-none"
								onClick={toggleMenu}
							>
								<img
									src={
										user.photo
											? `${baseUrl}${user.photo}`
											: "/default-avatar.png"
									}
									alt={user.name}
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
										onClick={() => dispatch(logout())}
										className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
									>
										{t("header.menu.logout", "Cerrar sesión")}
									</button>
								</div>
							)}
						</>
					) : (
						<div className="flex space-x-2">
							<NavLink
								to="/login"
								className={({ isActive }) =>
									`rounded-lg px-5 py-2 font-semibold transition duration-300 ${
										isActive
											? "bg-background-light-grey text-text-heading"
											: "text-text-body hover:bg-background-light-grey"
									}`
								}
							>
								{t("header.login", "Login")}
							</NavLink>
							<NavLink
								to="/register"
								className={({ isActive }) =>
									`rounded-lg px-5 py-2 font-semibold transition duration-300 ${
										isActive
											? "bg-primary-dark text-text-on-accent"
											: "bg-primary text-text-on-accent hover:bg-primary-dark"
									}`
								}
							>
								{t("header.signup", "Registro")}
							</NavLink>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
