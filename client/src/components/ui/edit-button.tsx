import EditIcon from "../icons/edit-icon.svg";
import "../../pages/boards/boards-list-item.css";

const EditButton = () => {
	return (
		<button className="edit-btn">
			<img src={EditIcon} alt="Edit board" />
		</button>
	);
};

export default EditButton;
