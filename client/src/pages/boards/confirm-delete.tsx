import { useTranslation } from "react-i18next";
import "./confirm-delete.css";

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
		<div className="confirm-bg">
			<article className="confirm-card">
				<p className="confirm-p">{message}</p>
				<div className="confirm-btns-container">
					<button className="confirm-btn" onClick={handleDeleteBoard}>
						{t("confirm.yes", "SI")}
					</button>
					<button className="confirm-btn" onClick={handleHideMessage}>
						{t("confirm.no", "NO")}
					</button>
				</div>
			</article>
		</div>
	);
};

export default ConfirmDelete;
