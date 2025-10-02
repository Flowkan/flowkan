import { useTranslation } from "react-i18next";
import "./add-button.css";
import { Icon } from "@iconify/react";
import { Button } from "./Button";

interface AddButtonProps {
	showAddForm: () => void;
}

const AddButton = ({ showAddForm }: AddButtonProps) => {
	const { t } = useTranslation();

	return (
		<Button className="add-btn" onClick={showAddForm}>
			<Icon
				name="add"
				icon="ri:add-line"
				width="20"
				height="20"
				style={{ color: "#bdb5c4" }}
			/>
			<p className="p-add">{t("addbtn", "Nuevo tablero")}</p>
		</Button>
	);
};

export default AddButton;
