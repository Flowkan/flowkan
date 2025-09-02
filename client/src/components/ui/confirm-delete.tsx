import { useTranslation } from "react-i18next";

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
	return (
		<div className="confirm-bg">
			<article className="confirm-card">
				<p className="confirm-p">{message}</p>
				<div className="confirm-btns">
					<button className="confirm-yes-btn" onClick={handleDeleteBoard}>
						SI
					</button>
					<button className="confirm-yes-btn" onClick={handleHideMessage}>
						NO
					</button>
				</div>
			</article>
		</div>
	);
};

export default ConfirmDelete;
