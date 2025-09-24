import { useTranslation } from "react-i18next";
import { Form } from "../Form";
import { FormFields } from "../FormFields";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import CloseButton from "../close-button";
import "./modal-boards.css";
import { Button } from "../Button";
import { addBoard } from "../../../store/boards/actions";
import { useAppDispatch } from "../../../store";
import { SpinnerLoadingText } from "../Spinner";

interface NewBoardProps {
	onClose: () => void;
}

const NewBoard = ({ onClose }: NewBoardProps) => {
	const { t } = useTranslation();
	const [titleInput, setTitleInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useAppDispatch();
	const fileRef = useRef<HTMLInputElement>(null);

	const isDisabled = !titleInput && isSubmitting;

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const boardData = new FormData();
		boardData.append("title", titleInput);
		const file = fileRef.current?.files?.[0];

		if (isSubmitting) return;
		setIsSubmitting(true);

		if (file) {
			boardData.append("image", file);
		}

		try {
			await dispatch(addBoard(boardData));
			onClose(); // Cierra el modal solo si la creación fue exitosa
		} catch (error) {
			console.error("Error al crear el tablero", error);
		} finally {
			setIsSubmitting(false);
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
							autoFocus
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
					<div className="file-container">
						<FormFields
							labelClassName="upload-img-label"
							label={t("newboard.form.img", "Fondo")}
							inputClassName="upload-img-container"
							id="bg-img"
							name="bg-img"
							type="file"
							ref={fileRef}
						/>
					</div>
					<Button type="submit" className="form-btn" disabled={isDisabled || isSubmitting}>
						{isSubmitting ? (
							<SpinnerLoadingText text="Creando" className="text-white"/>
						) : (
							t("newboard.form.button", "CREAR")
						)}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default NewBoard;
