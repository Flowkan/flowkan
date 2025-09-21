import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useLogoutAction } from "../../store/auth/hooks";
import { useDismiss } from "../../hooks/useDismissClickAndEsc";

interface UserMenuProps {
	user?: { name: string; photo?: string | null } | null;
	avatarSize?: number;
}

export const UserMenu: React.FC<UserMenuProps> = ({
	user,
	avatarSize = 40,
}) => {
	const { t } = useTranslation();
	const logoutAction = useLogoutAction();

	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
	const toggleMenu = () => setOpen((prev) => !prev);

	if (!user) return null;

	const handleLogout = async () => {
		logoutAction();
	};

	return (
		<div ref={ref} className="relative">
			<Button
				className="flex items-center rounded-full focus:outline-none"
				onClick={toggleMenu}
				title={`Menu de ajustes de ${user.name}`}
				aria-label="Menu del usuario"
			>
				<Avatar
					name={user.name}
					photo={user.photo ? user.photo : null}
					size={avatarSize}
				/>
			</Button>

			{open && (
				<div className="ring-opacity-5 absolute right-0 z-90 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black">
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
						onClick={handleLogout}
						className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					>
						{t("header.menu.logout", "Cerrar sesión")}
					</Button>
				</div>
			)}
		</div>
	);
};
