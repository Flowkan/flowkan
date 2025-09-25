import { NavLink } from "react-router-dom";
import LanguageToggle from "../ui/LangToggle";
import { useAppSelector } from "../../store";
import { UserMenu } from "../ui/UserMenu";
import IconLogo from "../icons/IconLogo";

export const BackofficeHeader: React.FC = () => {
	const { user } = useAppSelector((state) => state.auth);

	return (
		<header className="flex w-full items-center justify-between bg-gray-800 px-6 py-4 text-white shadow-md">
			<NavLink to="/">
				<div className="flex items-center space-x-2">
					<IconLogo
						width={250}
						height={80}
						textColor="white"
						className="h-auto w-32 md:w-[250px]"
					/>
				</div>
			</NavLink>

			<div className="flex items-center space-x-4">
				<LanguageToggle />

				<UserMenu user={user} avatarSize={40} />
			</div>
		</header>
	);
};
