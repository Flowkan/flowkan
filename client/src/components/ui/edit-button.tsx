import EditIcon from "../icons/edit-icon.svg";
import "../../pages/boards/boards-list-item.css";

interface EditButtonProps {
	showEditForm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const EditButton = ({ showEditForm }: EditButtonProps) => {
	return (
		<button className="edit-btn" onClick={(ev) => showEditForm(ev)}>
			<img src={EditIcon} alt="Edit board" />
		</button>
	);
};

export default EditButton;
