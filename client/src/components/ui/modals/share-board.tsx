import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import CloseButton from "../close-button";
import type { Board } from "../../../pages/boards/types";
import { createInvitationLink } from "../../../pages/boards/service";
import "./modal-boards.css";

interface ShareBoardProps {
	board: Board;
	handleHideMessage: () => void;
}

const ShareBoard = ({ board, handleHideMessage }: ShareBoardProps) => {
	const { t } = useTranslation();
	const [invitationLink, setInvitationLink] = useState<string | null>(null);
	const [status, setStatus] = useState<
		"idle" | "loading" | "succeeded" | "failed"
	>("idle");
	const [error, setError] = useState<string | null>(null);

	const handleCopyLink = () => {
		if (invitationLink) {
			navigator.clipboard.writeText(invitationLink);
		}
	};

	const handleGenerateLink = async () => {
		if (!board.id) {
			setError(
				"No se puede generar el enlace: el ID del tablero no está definido.",
			);
			return;
		}

		setStatus("loading");
		setError(null);

		try {
			const response = await createInvitationLink(board.id);
			const token = response.token;
			const FE_BASE_URL = window.location.origin;
			let fullInvitationUrl = `${FE_BASE_URL}/invitacion?token=${token}&username=${response.inviterName}&title=${response.boardTitle}&boardId=${response.boardId}&boardSlug=${response.slug}`;
			if (response.inviterPhoto) {
				fullInvitationUrl += `&photo=${response.inviterPhoto}`;
			}
			setInvitationLink(fullInvitationUrl);
			setStatus("succeeded");
		} catch (err) {
			setStatus("failed");
			setError("Error al generar el enlace de invitación.");
			console.error(err);
		}
	};

	const handleClose = () => {
		handleHideMessage();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<article className="relative mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
				<CloseButton onClick={handleClose} className="absolute top-4 right-4" />
				<h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
					{t("share.board.title", "Compartir tablero")}
				</h3>
				<div className="invitation-link-section mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
					<p className="mb-2 text-gray-700 dark:text-gray-300">
						{t(
							"share.board.link.text",
							"Genera un enlace de invitación que puedes compartir con quien quieras.",
						)}
					</p>
					{!invitationLink && (
						<Button
							type="button"
							onClick={handleGenerateLink}
							className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2 font-bold text-[var(--color-text-on-accent)] transition-colors duration-500 ease-in-out hover:bg-[var(--color-primary-hover)]"
							disabled={status === "loading"}
						>
							{status === "loading"
								? "Creando enlace..."
								: t("share.board.link.button", "Generar enlace de invitación")}
						</Button>
					)}
					{invitationLink && (
						<div className="invitation-link-display mt-4 flex items-center justify-between space-x-2 rounded-md border border-gray-300 bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700">
							<span className="truncate text-sm text-gray-700 dark:text-gray-300">
								{invitationLink}
							</span>
							<Button
								onClick={handleCopyLink}
								className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 p-1 text-xs font-bold transition-colors hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
							>
								Copiar
							</Button>
						</div>
					)}
					{error && <p className="mt-2 text-sm text-red-500">{error}</p>}
				</div>
			</article>
		</div>
	);
};

export default ShareBoard;
