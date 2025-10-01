import "../../pages/boards/boards-list-item.css";
import { Icon } from "@iconify/react";

interface TrashButtonProps {
	showConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TrashButton = ({ showConfirm }: TrashButtonProps) => {
	return (
		<button className="trash-btn" onClick={(ev) => showConfirm(ev)}>
			<Icon
				name="trash"
				icon="bi:trash-fill"
				width="20"
				height="20"
				style={{ color: "#b30606" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</button>
	);
};

export default TrashButton;
