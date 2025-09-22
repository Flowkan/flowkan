import { useTranslation } from "react-i18next";
import { Form } from "../Form";
import { FormFields } from "../FormFields";
import { useState, type ChangeEvent, type FormEvent } from "react";
import CloseButton from "../close-button";
import "./modal-boards.css";
import { Button } from "../Button";
import { useDispatch } from "react-redux";
import { addBoard } from "../../../store/boards/actions";
import type { AppDispatch } from "../../../store";

interface NewBoardProps {
	onClose: () => void;
}

const NewBoard = ({ onClose }: NewBoardProps) => {
	const { t } = useTranslation();
	const [titleInput, setTitleInput] = useState("");
	const dispatch = useDispatch<AppDispatch>();

	const isDisabled = !titleInput;

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = {
			title: titleInput,
		};

		try {
			await dispatch(addBoard(data));
			onClose(); // Cierra el modal solo si la creación fue exitosa
		} catch (error) {
			console.error("Error al crear el tablero", error);
		}
	};

	return (
		<div className="modal-bg">
			<article className="modal-card">
				<CloseButton className="closebtn-form" onClick={onClose} />
				<h3 className="modal-header">
					{t("newboard.form.header", "Crear tablero")}
				</h3>
				<Form className="modal-form" method="POST" onSubmit={handleSubmit}>
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
					<Button type="submit" className="form-btn" disabled={isDisabled}>
						{t("newboard.form.button", "CREAR")}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default NewBoard;
