import { useTranslation } from "react-i18next";
import { Page } from "../../components/layout/page";
import { useBoardsAddAction } from "../../store/hooks";

const NewBoardPage = () => {
	const { t } = useTranslation();

	const newBoard = useBoardsAddAction();

	// TODO: pasar al ingles
	return (
		<Page title={t("newboard.title", "Crear nuevo tablero")}>
			<form className="new-board-form">
				<div className="form-element"></div>
			</form>
		</Page>
	);
};

export default NewBoardPage;
