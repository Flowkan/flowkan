import { Link } from "react-router-dom";
import AddIcon from "../icons/add-icon.svg";
import "./add-button.css";
import { useTranslation } from "react-i18next";

const AddButton = () => {
	const { t } = useTranslation();

	return (
		<Link className="add-btn" to="/boards/new">
			<img src={AddIcon} alt="Add board" />
			<p className="p-add">{t("addbtn", "Nuevo tablero")}</p>
		</Link>
	);
};

export default AddButton;
