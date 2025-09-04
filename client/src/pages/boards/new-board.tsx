import { useTranslation } from "react-i18next";
import { useBoardsAddAction } from "../../store/hooks";
import { Form } from "../../components/ui/Form";
import { FormFields } from "../../components/ui/FormFields";
import { useState, type ChangeEvent, type FormEvent } from "react";
import CloseButton from "../../components/ui/close-button";

interface NewBoardProps {
	onClose: () => void;
}

const NewBoard = ({ onClose }: NewBoardProps) => {
	const { t } = useTranslation();
	const [titleInput, setTitleInput] = useState("");
	const newBoard = useBoardsAddAction();

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const toPost = new FormData();
		toPost.append("title", titleInput);

		await newBoard(toPost);
	};

	return (
		<div className="newboardform-bg">
			<article className="newboardform-card">
				<CloseButton onClick={onClose} />
				<h3 className="newboardform-header">
					{t("newboard.form.header", "Crear tablero")}
				</h3>
				<Form className="new-board-form" method="POST" onSubmit={handleSubmit}>
					<div className="form-element">
						<FormFields
							id="boardtitle"
							name="boardtitle"
							label={t("newboard.form.title", "Título del tablero")}
							type="text"
							required
							labelClassName="form-label"
							value={titleInput}
							onChange={handleTitleChange}
						/>
					</div>
				</Form>
			</article>
		</div>
	);
};

export default NewBoard;
