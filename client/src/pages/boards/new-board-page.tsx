import { useTranslation } from "react-i18next";
import { Page } from "../../components/layout/page";

const NewBoardPage = () => {
	const { t } = useTranslation();

	// TODO: pasar al ingles
	return (
		<Page title={t("newboard.title", "Crear nuevo tablero")}>
			<form className="new-board-form"></form>
		</Page>
	);
};

export default NewBoardPage;
