import AddIcon from "../icons/add-icon.svg";
import "./add-button.css";
import { useTranslation } from "react-i18next";

interface AddButtonProps {
	showAddForm: () => void;
}

const AddButton = ({ showAddForm }: AddButtonProps) => {
	const { t } = useTranslation();

	return (
		<button className="add-btn" onClick={showAddForm}>
			<img src={AddIcon} alt="Add board" />
			<p className="p-add">{t("addbtn", "Nuevo tablero")}</p>
		</button>
	);
};

export default AddButton;
