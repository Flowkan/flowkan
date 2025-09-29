import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Page } from "../../components/layout/page";
import { useTranslation } from "react-i18next";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../store/auth/hooks";

const InvitationPage = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();

	const boardTitle = searchParams.get("title");
	const invitatorName = searchParams.get("username");
	const invitatorPhoto = searchParams.get("photo");
	const boardSlug = searchParams.get("boardSlug");
	const navigate = useNavigate();
	const isLogged = useAuth();

	useEffect(() => {
		const token = searchParams.get("token");
		const boardId = searchParams.get("boardId");
		if (token && boardId && boardSlug) {
			localStorage.setItem("invitationToken", token);
			localStorage.setItem("invitationBoardId", boardId);
			localStorage.setItem("invitationBoardSlug", boardSlug);
		} else {
			navigate("/", { replace: true });
		}
	}, [searchParams, navigate, boardSlug]);

	const handleLogin = () => {
		navigate("/login");
	};

	const handleRegister = () => {
		navigate("/register");
	};

	return (
		<Page title={t("invitation.title", "Invitación a tablero")}>
			<div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
				<h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
					{invitatorName}{" "}
					{t("invitation.shared", "te ha compartido el tablero:")} {boardTitle}
				</h1>
				<div className="my-6 flex flex-col items-center">
					{invitatorPhoto !== null ? (
						<Avatar
							name={invitatorName || ""}
							photo={invitatorPhoto}
							size={90}
						/>
					) : (
						<div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-300">
							<svg
								className="h-16 w-16 text-gray-500"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clipRule="evenodd"
								></path>
							</svg>
						</div>
					)}
					<p className="text-gray-700 dark:text-gray-300">
						{t("invitation.collaborate", "Colabora en este tablero junto a")}{" "}
						{invitatorName}
					</p>
				</div>
				<div className="mt-8 flex space-x-4">
					{isLogged ? (
						<Button
							onClick={() => navigate(`/board/${boardSlug}`)}
							className="rounded-lg bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
						>
							{t("invitation.view_board", "Ver tablero")}
						</Button>
					) : (
						<>
							<Button
								onClick={handleRegister}
								className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 font-bold text-white"
							>
								{t("invitation.register_button", "Registrarse")}
							</Button>
							<Button
								onClick={handleLogin}
								className="rounded-lg bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
							>
								{t("invitation.login_button", "Iniciar sesión")}
							</Button>
						</>
					)}
				</div>
			</div>
		</Page>
	);
};

export default InvitationPage;
