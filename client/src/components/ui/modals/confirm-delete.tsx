import { useTranslation } from "react-i18next";
/* import "./confirm-delete.css"; */
import "./modal-boards.css";
import { IconCancel } from "../../icons/IconCancel";

interface ConfirmDeleteProps {
	handleDeleteBoard: () => void;
	handleHideMessage: () => void;
	message: string;
}

const ConfirmDelete = ({
	handleDeleteBoard,
	handleHideMessage,
	message,
}: ConfirmDeleteProps) => {
	const { t } = useTranslation();
	return (
		<div data-modal className="modal-bg">
			<article className="modal-card">
				<header className="flex justify-end pb-3">
					<button
						onClick={handleHideMessage}
						className="hover:bg-accent cursor-pointer rounded-md p-2 transition-colors duration-300 hover:text-white"
					>
						<IconCancel />
					</button>
				</header>
				<h3 className="modal-header confirm">{message}</h3>
				<div className="modal-btns-container">
					<button className="modal-btn yes" onClick={handleDeleteBoard}>
						{t("confirm.yes")}
					</button>
					<button className="modal-btn" onClick={handleHideMessage}>
						{t("confirm.no")}
					</button>
				</div>
			</article>
		</div>
	);
};

export default ConfirmDelete;
