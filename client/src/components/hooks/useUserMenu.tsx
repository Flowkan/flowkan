import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface UserMenuProps {
	user?: { name: string; photo?: string | null } | null;
	baseUrl: string;
	avatarSize?: number;
}

export const UserMenu: React.FC<UserMenuProps> = ({
	user,
	baseUrl,
	avatarSize = 40,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => setMenuOpen((prev) => !prev);

	useEffect(() => {
		const handleClickOutsideMenu = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutsideMenu);
		return () => {
			document.removeEventListener("mousedown", handleClickOutsideMenu);
		};
	}, []);

	if (!user) return null;

	return (
		<div ref={menuRef} className="relative">
			<Button
				className="flex items-center rounded-full focus:outline-none"
				onClick={toggleMenu}
        title={`Menu de ajustes de ${user.name}`}
        aria-label="Menu del usuario"
			>
				<Avatar
					name={user.name}
					photo={user.photo ? `${baseUrl}${user.photo}` : null}
					size={avatarSize}
				/>
			</Button>

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
					<Button
						onClick={() => dispatch(logout())}
						className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					>
						{t("header.menu.logout", "Cerrar sesión")}
					</Button>
				</div>
			)}
		</div>
	);
};
