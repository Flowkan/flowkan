import { useTranslation } from "react-i18next";
/* import "./confirm-delete.css"; */
import "./modal-boards.css";

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
		<div className="modal-bg">
			<article className="modal-card">
				<h3 className="modal-header confirm">{message}</h3>
				<div className="modal-btns-container">
					<button className="modal-btn" onClick={handleDeleteBoard}>
						{t("confirm.yes", "SI")}
					</button>
					<button className="modal-btn" onClick={handleHideMessage}>
						{t("confirm.no", "NO")}
					</button>
				</div>
			</article>
		</div>
	);
};

export default ConfirmDelete;
