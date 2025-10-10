import { useTranslation } from "react-i18next";
import "../../pages/boards/boards-list-item.css";
import { Button } from "./Button";
import { Icon } from "@iconify/react";

interface ShareButtonProps {
	showShareForm: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShareButton = ({ showShareForm }: ShareButtonProps) => {
	const { t } = useTranslation();
	return (
		<Button
			className="share-btn"
			onClick={showShareForm}
			title={t("shareBtn.title")}
		>
			<Icon
				name="share"
				icon="bi:share-fill"
				width="20"
				height="20"
				style={{ color: "#181bfb" }}
				className="cursor-pointer transition-transform duration-200 hover:scale-120"
			/>
		</Button>
	);
};

export default ShareButton;
