import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "../Form";
import { FormFields } from "../FormFields";
import "./modal-boards.css";
import CloseButton from "../close-button";
import { Button } from "../Button";
import type { EditBoardsData } from "../../../pages/boards/types";
import toast from "react-hot-toast";
import { CustomToast } from "../../CustomToast";

interface EditFormProps {
	handleEditForm: (newData: EditBoardsData) => void;
	handleHideMessage: () => void;
	oldTitle: string;
}

const EditBoard = ({
	handleEditForm,
	handleHideMessage,
	oldTitle,
}: EditFormProps) => {
	const [titleInput, setTitleInput] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);
	const [fileChanged, setFileChanged] = useState(false);
	const { t: translation } = useTranslation();

	const isDisabled = !titleInput && !fileChanged;

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleFileChange = () => {
		setFileChanged(true);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newData: EditBoardsData = {};

		if (titleInput) {
			newData.title = titleInput;
		}

		const file = fileRef.current?.files?.[0];
		if (file) {
			const maxSizeMB = 5;

			if (file.size > maxSizeMB * 1024 * 1024) {
				toast.custom((t) => (
					<CustomToast
						message={translation("editBoard.toast.errorImage")}
						t={t}
						type="error"
					/>
				));
				return;
			}

			newData.image = file;
		}

		try {
			handleEditForm(newData);
			handleHideMessage();
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}
		}
	};

	return (
		<div className="modal-bg">
			<article className="modal-card">
				<CloseButton className="closebtn-form" onClick={handleHideMessage} />
				<h3 className="modal-header">{translation("editBoard.form.header")}</h3>
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
							label={translation("editBoard.form.newTitle")}
							type="text"
							placeholder={oldTitle}
							labelClassName="form-label"
							value={titleInput}
							onChange={handleTitleChange}
							autoFocus
						/>
					</div>
					<div className="file-container">
						<FormFields
							labelClassName="upload-img-label"
							label={translation("editBoard.form.newImg")}
							inputClassName="upload-img-container"
							id="bg-img"
							name="bg-img"
							type="file"
							ref={fileRef}
							onChange={handleFileChange}
						/>
					</div>
					<Button type="submit" className="form-btn" disabled={isDisabled}>
						{translation("editBoard.edit")}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default EditBoard;
