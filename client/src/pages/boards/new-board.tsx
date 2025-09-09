import { useTranslation } from "react-i18next";
import { Form } from "../../components/ui/Form";
import { FormFields } from "../../components/ui/FormFields";
import { useState, type ChangeEvent, type FormEvent } from "react";
import CloseButton from "../../components/ui/close-button";
import "./new-board.css";
import { Button } from "../../components/ui/Button";
import { useDispatch } from "react-redux";
import { addBoard } from "../../store/boardsSlice";
import type { AppDispatch } from "../../store/store";

interface NewBoardProps {
	onClose: () => void;
	onBoardCreated: () => void;
}

const NewBoard = ({ onClose, onBoardCreated }: NewBoardProps) => {
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
			await dispatch(addBoard(data)).unwrap();
			onBoardCreated();
			onClose(); // Cierra el modal solo si la creación fue exitosa
		} catch (error) {
			console.error("Error al crear el tablero:", error);
		}
	};

	return (
		<div className="newboardform-bg">
			<article className="newboardform-card">
				<CloseButton className="closebtn-form" onClick={onClose} />
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
					<Button type="submit" className="form-btn" disabled={isDisabled}>
						{t("newboard.form.button", "CREAR")}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default NewBoard;
