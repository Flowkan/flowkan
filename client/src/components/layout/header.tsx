import React, { useState } from "react";
import { useAppSelector } from "../../store";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../ui/LangToggle";
import { UserMenu } from "../ui/UserMenu";
import { Icon } from "@iconify/react";
import IconLogo from "../icons/IconLogo";

export const Header: React.FC = () => {
	const { t } = useTranslation();
	const { user, isAuthenticated } = useAppSelector((state) => state.auth);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="bg-background-card relative flex items-center justify-between px-6 py-4 shadow-sm md:px-12">
			<div className="flex items-center space-x-8">
				<NavLink to="/">
					<div className="flex items-center">
						<IconLogo width={250} height={80} />
					</div>
				</NavLink>

				<nav className="text-text-body hidden space-x-6 md:flex">
					<a href="/features" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.features", "Características")}
					</a>
					<a href="/solutions" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.solutions", "Soluciones")}
					</a>
					<a href="/prices" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.prices", "Precios")}
					</a>
					{isAuthenticated && user && (
						<NavLink to={"/boards"}>
							{t("header.navbar.backoffice", "Backoffice")}
						</NavLink>
					)}
				</nav>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-3">
					<LanguageToggle />
				</div>

				<div className="relative hidden md:flex">
					{isAuthenticated && user ? (
						<UserMenu user={user} />
					) : (
						<div className="flex space-x-2">
							<NavLink className="px-4 py-2" to="/login">
								{t("header.login", "Login")}
							</NavLink>
							<NavLink
								className="bg-primary text-text-on-accent hover:bg-primary-dark rounded-lg px-4 py-2 text-center font-semibold"
								to="/register"
							>
								{t("header.signup", "Registro")}
							</NavLink>
						</div>
					)}
				</div>

				<button
					className="text-text-heading p-2 md:hidden"
					onClick={() => setIsOpen(!isOpen)}
					aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
				>
					<Icon
						icon={isOpen ? "lucide:x" : "lucide:menu"}
						className="h-6 w-6"
					/>
				</button>
			</div>

			<div
				className={`bg-background-card absolute top-full left-0 z-50 w-full transform shadow-lg transition-all duration-300 ease-in-out md:hidden ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"}`}
			>
				<div className="flex flex-col space-y-4 p-4">
					<NavLink
						to="/features"
						className="text-text-body hover:text-accent font-medium"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.features", "Características")}
					</NavLink>
					<NavLink
						to="/solutions"
						className="text-text-body hover:text-accent font-medium"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.solutions", "Soluciones")}
					</NavLink>
					<NavLink
						to="/prices"
						className="text-text-body hover:text-accent font-medium"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.prices", "Precios")}
					</NavLink>

					{isAuthenticated && user && (
						<NavLink
							to={"/boards"}
							className="text-text-body hover:text-accent font-medium"
							onClick={() => setIsOpen(false)}
						>
							{t("header.navbar.backoffice", "Backoffice")}
						</NavLink>
					)}

					{!isAuthenticated && (
						<div className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
							<NavLink
								to="/login"
								className="text-text-body hover:bg-background-light-grey rounded-lg px-4 py-2 text-center font-semibold"
								onClick={() => setIsOpen(false)}
							>
								{t("header.login", "Login")}
							</NavLink>
							<NavLink
								to="/register"
								className="bg-primary text-text-on-accent hover:bg-primary-dark rounded-lg px-4 py-2 text-center font-semibold"
								onClick={() => setIsOpen(false)}
							>
								{t("header.signup", "Registro")}
							</NavLink>
						</div>
					)}

					{isAuthenticated && user && (
						<div className="border-t border-gray-100 pt-4">
							<span className="text-text-body font-medium">
								{t("header.welcome", "Bienvenido")}, {user.name}
							</span>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
