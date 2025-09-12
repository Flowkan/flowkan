import EditIcon from "../icons/edit-icon.svg";
import "../../pages/boards/boards-list-item.css";

interface EditButtonProps {
	showEditForm: () => void;
}

const EditButton = ({ showEditForm }: EditButtonProps) => {
	return (
		<button className="edit-btn" onClick={showEditForm}>
			<img src={EditIcon} alt="Edit board" />
		</button>
	);
};

export default EditButton;
