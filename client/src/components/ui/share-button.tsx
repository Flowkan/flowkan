import ShareIcon from "../icons/share-icon.svg";
import "../../pages/boards/boards-list-item.css";
import { Button } from "./Button";

interface ShareButtonProps {
	showShareForm: (event: React.MouseEvent) => void;
}

const ShareButton = ({ showShareForm }: ShareButtonProps) => {
	return (
		<Button className="share-btn" onClick={showShareForm}>
			<img src={ShareIcon} alt="Share board" />
		</Button>
	);
};

export default ShareButton;