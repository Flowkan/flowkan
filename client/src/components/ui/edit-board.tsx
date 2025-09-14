import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "./Form";
import { FormFields } from "./FormFields";

interface EditFormProps {
	handleEditForm: (newData: string) => void;
	handleHideMessage: () => void;
}

const EditBoard = ({ handleEditForm, handleHideMessage }: EditFormProps) => {
	const [titleInput, setTitleInput] = useState("");
	const { t } = useTranslation();

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleEditForm(titleInput);
		handleHideMessage();
	};

	return (
		<div className="edit-bg">
			<article className="edit-card">
				<Form
					id="edittitleform"
					className="edit-board-form"
					onSubmit={handleSubmit}
					method="POST"
				>
					<div className="form-element">
						<FormFields
							id="boardtitle"
							name="boardtitle"
							label={t("editboard.form.newtitle", "Nuevo título")}
							type="text"
							required
							labelClassName="form-label"
							value={titleInput}
							onChange={handleTitleChange}
						/>
					</div>
				</Form>
				<div className="confirm-btns-container">
					<button className="confirm-btn" form="edittitleform">
						{t("editboard.edit", "EDITAR")}
					</button>
					<button className="confirm-btn" onClick={handleHideMessage}>
						{t("editboard.cancel", "CANCELAR")}
					</button>
				</div>
			</article>
		</div>
	);
};

export default EditBoard;
