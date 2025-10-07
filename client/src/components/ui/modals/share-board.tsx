import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import CloseButton from "../close-button";
import { createInvitationLink } from "../../../pages/boards/service";
import "./modal-boards.css";
import { Icon } from "@iconify/react";

interface ShareBoardProps {
	boardId: string;
	handleHideMessage: () => void;
}

const ShareBoard = ({ boardId, handleHideMessage }: ShareBoardProps) => {
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
		if (!boardId) {
			const setErrorMsgId = t("share.error.id");
			setError(setErrorMsgId);
			return;
		}

		setStatus("loading");
		setError(null);

		try {
			const response = await createInvitationLink(boardId);
			const token = response.token;
			const FE_BASE_URL = window.location.origin;
			let fullInvitationUrl = `${FE_BASE_URL}/invitacion?token=${token}&username=${response.inviterName}&title=${response.boardTitle}&boardId=${response.boardId}&boardSlug=${response.slug}`;
			if (response.inviterPhoto) {
				fullInvitationUrl += `&photo=${response.inviterPhoto}`;
			}
			setInvitationLink(fullInvitationUrl);
			setStatus("succeeded");
		} catch (err) {
			const setErrorMsgLink = t("share.error.link");
			setStatus("failed");
			setError(setErrorMsgLink);
			console.error(err);
		}
	};

	const handleClose = () => {
		handleHideMessage();
	};

	return (
		<div className="modal-bg fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<article className="modal-card relative mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
				<CloseButton onClick={handleClose} className="absolute top-4 right-4" />
				<h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
					{t("share.board.title")}
				</h3>
				<div className="invitation-link-section mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
					<p className="mb-2 text-gray-700">{t("share.board.link.text")}</p>
					{!invitationLink && (
						<Button
							type="button"
							onClick={handleGenerateLink}
							className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2 font-bold text-[var(--color-text-on-accent)] transition-colors duration-500 ease-in-out hover:bg-[var(--color-primary-hover)]"
							disabled={status === "loading"}
						>
							{status === "loading"
								? t("share.board.link.creating")
								: t("share.board.link.button")}
						</Button>
					)}
					{invitationLink && (
						<div className="invitation-link-display mt-4 flex items-center justify-between space-x-2 rounded-md border border-gray-300 bg-gray-100 p-2 dark:border-gray-600 dark:bg-gray-700">
							<span className="truncate text-sm text-gray-700">
								{invitationLink}
							</span>
							<Button
								onClick={handleCopyLink}
								title={t("share.board.link.copy")}
								className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 p-1 text-xs font-bold transition-colors hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
							>
								<Icon
									name="copy-share"
									icon="flowbite:file-copy-alt-solid"
									width="20"
									height="20"
									style={{ color: "#fff" }}
									xlinkTitle="copiar"
								/>
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
