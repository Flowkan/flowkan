import { Link } from "react-router-dom";
import AddIcon from "../icons/add-icon.svg";
import "./add-button.css";

const AddButton = () => {
	return (
		<Link className="add-btn" to="/boards/new">
			<img src={AddIcon} alt="Add board" />
			<p className="p-add">Nuevo tablero</p>
		</Link>
	);
};

export default AddButton;
