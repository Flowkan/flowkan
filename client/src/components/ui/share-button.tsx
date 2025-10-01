import "../../pages/boards/boards-list-item.css";
import { Button } from "./Button";
import { Icon } from "@iconify/react";

interface ShareButtonProps {
	showShareForm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShareButton = ({ showShareForm }: ShareButtonProps) => {
	return (
		<Button className="share-btn" onClick={showShareForm}>
			<Icon
				name="share"
				icon="bi:share-fill"
				width="20"
				height="20"
				style={{ color: "#181bfb" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</Button>
	);
};

export default ShareButton;
