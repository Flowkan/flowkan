import "../../pages/boards/boards-list-item.css";
import { Icon } from "@iconify/react";
import { Button } from "./Button";

interface TrashButtonProps {
	showConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TrashButton = ({ showConfirm }: TrashButtonProps) => {
	return (
		<Button className="trash-btn" onClick={(ev) => showConfirm(ev)} title="Eliminar">
			<Icon
				name="trash"
				icon="bi:trash-fill"
				width="20"
				height="20"
				style={{ color: "#b30606" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</Button>
	);
};

export default TrashButton;
