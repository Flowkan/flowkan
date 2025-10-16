import { useTranslation } from "react-i18next";
import { Form } from "../Form";
import { FormFields } from "../FormFields";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import CloseButton from "../close-button";
import "./modal-boards.css";
import { Button } from "../Button";
import { addBoard } from "../../../store/boards/actions";
import { useAppDispatch, useAppSelector } from "../../../store";
import { SpinnerLoadingText } from "../Spinner";
import toast from "react-hot-toast";
import { CustomToast } from "../../CustomToast";
import UpgradeModal from "./UpgradeModal";
import type { LimitErrorData } from "../../../pages/boards/types";
import { useUiResetError } from "../../../store/boards/hooks";

interface NewBoardProps {
	onClose: () => void;
}

const NewBoard = ({ onClose }: NewBoardProps) => {
	const { t: translation } = useTranslation();
	const [titleInput, setTitleInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useAppDispatch();
	const fileRef = useRef<HTMLInputElement>(null);
	const resetError = useUiResetError();

	const limitErrorData = useAppSelector(
		(state) => state.ui.error as LimitErrorData | null,
	);

	const handleClose = () => {
		resetError();
		onClose();
	};

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isSubmitting) return;
		setIsSubmitting(true);
		resetError();

		const boardData = new FormData();
		boardData.append("title", titleInput);

		const file = fileRef.current?.files?.[0];
		if (file) {
			const maxSizeMB = 5;
			if (file.size > maxSizeMB * 1024 * 1024) {
				toast.custom((t) => (
					<CustomToast
						message={translation("newBoard.toast.errorImage")}
						t={t}
						type="error"
					/>
				));
				setIsSubmitting(false);
				return;
			}
			boardData.append("image", file);
		}

		const success = await dispatch(addBoard(boardData));
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	if (limitErrorData?.errorCode === "LIMIT_BOARD_REACHED") {
		return (
			<UpgradeModal onClose={handleClose} message={limitErrorData.message} />
		);
	}

	return (
		<div className="modal-bg">
			<article className="modal-card">
				<CloseButton className="closebtn-form" onClick={handleClose} />
				<h3 className="modal-header">{translation("newBoard.form.header")}</h3>
				<Form className="modal-form" method="POST" onSubmit={handleSubmit}>
					<div className="form-element">
						<FormFields
							autoFocus
							id="boardtitle"
							name="boardtitle"
							label={translation("newBoard.form.title")}
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
							label={translation("newBoard.form.img")}
							inputClassName="upload-img-container"
							id="bg-img"
							name="bg-img"
							type="file"
							ref={fileRef}
						/>
					</div>

					<Button
						type="submit"
						className="form-btn"
						disabled={!titleInput || isSubmitting}
					>
						{isSubmitting ? (
							<SpinnerLoadingText
								text={translation("newBoard.spinner")}
								className="text-white"
							/>
						) : (
							translation("newBoard.form.button")
						)}
					</Button>
				</Form>
			</article>
		</div>
	);
};

export default NewBoard;
