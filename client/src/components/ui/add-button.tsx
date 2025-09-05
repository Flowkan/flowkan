import { useTranslation } from "react-i18next";
import AddIcon from "../icons/add-icon.svg";
import "./add-button.css";

interface AddButtonProps {
	onAdd?: () => void;
	to?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onAdd, to }) => {
	const { t } = useTranslation();

	if (to) {
		return (
			<a className="add-btn" href={to}>
				<img src={AddIcon} alt="Add" />
				<p className="p-add">{t("addbtn", "Nuevo tablero")}</p>
			</a>
		);
	}

	return (
		<button onClick={onAdd} className="add-btn">
			<img src={AddIcon} alt="Add" />
			<p className="p-add">{t("addbtn", "Nuevo tablero")}</p>
		</button>
	);
};

export default AddButton;
