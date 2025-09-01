interface ConfirmDeleteProps {
	handleDeleteBoard: () => void;
	handleHideMessage: () => void;
}

const ConfirmDelete = ({
	handleDeleteBoard,
	handleHideMessage,
}: ConfirmDeleteProps) => {
	return (
		<div className="confirm-bg">
			<article className="confirm-card">
				<p className="confirm-p">¿Seguro que quieres borrar este tablero?</p>
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
