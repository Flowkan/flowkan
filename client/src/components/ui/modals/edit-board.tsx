import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../Form";
import { FormFields } from "../FormFields";
import "./modal-boards.css";
import CloseButton from "../close-button";
import { Button } from "../Button";

interface EditFormProps {
	handleEditForm: (newData: string) => void;
	handleHideMessage: () => void;
}

const EditBoard = ({ handleEditForm, handleHideMessage }: EditFormProps) => {
	const [titleInput, setTitleInput] = useState("");
	const { t } = useTranslation();

	const isDisabled = !titleInput;

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		handleEditForm(titleInput);
		handleHideMessage();
	};

	return (
		<div className="modal-bg">
			<article className="modal-card">
				<CloseButton className="closebtn-form" onClick={handleHideMessage} />
				<h3 className="modal-header">
					{t("editboard.form.header", "Editar tablero")}
				</h3>
				<Form
					id="edittitleform"
					className="modal-form"
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
					<Button type="submit" className="form-btn" disabled={isDisabled}>
						{t("editboard.form.button", "EDITAR")}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default EditBoard;
