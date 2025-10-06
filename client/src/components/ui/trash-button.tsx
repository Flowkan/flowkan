import "../../pages/boards/boards-list-item.css";
import { Icon } from "@iconify/react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface TrashButtonProps {
	showConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const TrashButton = ({ showConfirm }: TrashButtonProps) => {
	const { t } = useTranslation();
	return (
		<Button
			className="trash-btn"
			onClick={(ev) => showConfirm(ev)}
			title={t("trashBtn.title")}
		>
			<Icon
				name="trash"
				icon="bi:trash-fill"
				width="20"
				height="20"
				style={{ color: "#b30606" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</Button>
	);
};

export default TrashButton;
