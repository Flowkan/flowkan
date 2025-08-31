import EditIcon from "../icons/edit-icon.svg";

const EditButton = () => {
	return (
		<button className="edit-btn">
			<img src={EditIcon} alt="Edit board" />
		</button>
	);
};

export default EditButton;
