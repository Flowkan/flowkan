import TrashIcon from "../icons/trash-icon.svg";

interface TrashButtonProps {
	showConfirm: () => void;
}

const TrashButton = ({ showConfirm }: TrashButtonProps) => {
	return (
		<button className="trash-btn" onClick={showConfirm}>
			<img src={TrashIcon} alt="Delete board" />
		</button>
	);
};

export default TrashButton;
