import React, { useState } from "react";
import { useAppSelector } from "../../store";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../ui/LangToggle";
import { UserMenu } from "../ui/UserMenu";
import { Icon } from "@iconify/react";
import IconLogo from "../icons/IconLogo";
import { Button } from "../ui/Button";
import { useLogoutAction } from "../../store/auth/hooks";
import { useSocket } from "../../hooks/socket/context";

export const Header: React.FC = () => {
	const { t } = useTranslation();
	const { user, isAuthenticated } = useAppSelector((state) => state.auth);
	const [isOpen, setIsOpen] = useState(false);
	const logoutAction = useLogoutAction();
	const socket = useSocket();

	const handleLogout = () => {
		logoutAction();
		setIsOpen(false);
		socket.disconnect(); //Desconecta el socket
	};

	return (
		<header className="bg-background-card relative flex items-center justify-between px-6 py-4 shadow-sm md:px-12">
			<div className="flex items-center space-x-8">
				<NavLink to="/" onClick={() => setIsOpen(false)}>
					<div className="flex items-center">
						<IconLogo
							width={250}
							height={40}
							className="h-auto w-32 md:w-[250px]"
						/>
					</div>
				</NavLink>

				<nav className="text-text-body hidden space-x-6 md:flex">
					<a href="/features" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.features")}
					</a>
					<a href="/solutions" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.solutions")}
					</a>
					<a href="/prices" className="hover:border-accent hover:border-b-2">
						{t("header.navbar.prices")}
					</a>
					{isAuthenticated && user && (
						<NavLink
							to={"/boards"}
							className={
								"text-primary hover:text-primary-hover rounded-lg px-4 text-center font-semibold"
							}
						>
							{t("header.navbar.boardsList")}
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
								{t("header.login")}
							</NavLink>
							<NavLink
								className="bg-primary text-text-on-accent hover:bg-primary-dark rounded-lg px-4 py-2 text-center font-semibold"
								to="/register"
							>
								{t("header.signup")}
							</NavLink>
						</div>
					)}
				</div>

				<button
					className="text-text-heading p-2 md:hidden"
					onClick={() => setIsOpen(!isOpen)}
					aria-label={
						isOpen ? t("header.btnmenu.close") : t("header.btnmenu.open")
					}
				>
					<Icon icon="lucide:menu" className="h-6 w-6" />
				</button>
			</div>

			<div
				className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} `}
				onClick={() => setIsOpen(false)}
				aria-hidden={!isOpen}
			/>

			<div
				className={`bg-background-card fixed top-0 right-0 z-50 h-full w-64 max-w-xs transform shadow-xl transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"} `}
			>
				<div className="flex flex-col space-y-4 p-4">
					<div className="flex items-center justify-between border-b pb-4">
						<NavLink to="/" onClick={() => setIsOpen(false)}>
							<IconLogo width={120} height={40} className="h-auto w-24" />
						</NavLink>
						<button
							className="text-text-heading p-2"
							onClick={() => setIsOpen(false)}
							aria-label={t("header.btnmenu.close")}
						>
							<Icon icon="lucide:x" className="h-6 w-6" />
						</button>
					</div>

					<NavLink
						to="/features"
						className="text-text-body hover:text-accent block rounded-md px-3 py-2 font-medium transition-colors hover:bg-gray-100"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.features")}
					</NavLink>
					<NavLink
						to="/solutions"
						className="text-text-body hover:text-accent block rounded-md px-3 py-2 font-medium transition-colors hover:bg-gray-100"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.solutions")}
					</NavLink>
					<NavLink
						to="/prices"
						className="text-text-body hover:text-accent block rounded-md px-3 py-2 font-medium transition-colors hover:bg-gray-100"
						onClick={() => setIsOpen(false)}
					>
						{t("header.navbar.prices")}
					</NavLink>

					{isAuthenticated && user && (
						<NavLink
							to={"/boards"}
							className="text-primary block rounded-md px-3 py-2 font-medium transition-colors"
							onClick={() => setIsOpen(false)}
						>
							{t("header.navbar.boardsList")}
						</NavLink>
					)}

					{!isAuthenticated && (
						<div className="flex flex-col space-y-2 border-t border-gray-100 pt-4">
							<NavLink
								to="/login"
								className="text-text-body hover:bg-background-light-grey rounded-lg px-4 py-2 text-center font-semibold"
								onClick={() => setIsOpen(false)}
							>
								{t("header.login")}
							</NavLink>
							<NavLink
								to="/register"
								className="bg-primary text-text-on-accent hover:bg-primary-dark rounded-lg px-4 py-2 text-center font-semibold"
								onClick={() => setIsOpen(false)}
							>
								{t("header.signup")}
							</NavLink>
						</div>
					)}

					{isAuthenticated && user && (
						<div className="border-t border-gray-100 pt-4">
							<span className="text-text-body block px-3 py-2 font-medium">
								{t("header.welcome")}, {user.name}
							</span>
							<Button
								onClick={handleLogout}
								className="bg-primary text-text-on-accent hover:bg-error-dark mt-4 w-full rounded-lg px-4 py-2 text-center font-semibold"
							>
								{t("header.menu.logout")}
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
