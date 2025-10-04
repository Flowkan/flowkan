import "../../pages/boards/boards-list-item.css";
import { Icon } from "@iconify/react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface EditButtonProps {
	showEditForm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const EditButton = ({ showEditForm }: EditButtonProps) => {
	const { t } = useTranslation();
	return (
		<Button
			className="edit-btn"
			onClick={(ev) => showEditForm(ev)}
			title={t("editbtn.title", "Editar")}
		>
			<Icon
				name="edit"
				icon="bi:pencil-fill"
				width="20"
				height="20"
				style={{ color: "#181bfb" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</Button>
	);
};

export default EditButton;
