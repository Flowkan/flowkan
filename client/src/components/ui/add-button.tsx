import { Link } from "react-router-dom";
import AddIcon from "../icons/add-icon.svg";

const AddButton = () => {
	return (
		<Link className="add-btn" to="/boards/new">
			<img src={AddIcon} alt="Add board" />
			<p>Nuevo tablero</p>
		</Link>
	);
};

export default AddButton;
