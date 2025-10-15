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
import toast from "react-hot-toast";
import { CustomToast } from "../../CustomToast";
import type { AxiosError } from "axios";
import UpgradeModal from "./UpgradeModal";
import type { LimitErrorData } from "../../../pages/boards/types";

interface NewBoardProps {
	onClose: () => void;
}

const NewBoard = ({ onClose }: NewBoardProps) => {
	const { t: translation } = useTranslation();
	const [titleInput, setTitleInput] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showLimitModal, setShowLimitModal] = useState(false);
	const [limitErrorData, setLimitErrorData] = useState<LimitErrorData | null>(
		null,
	);
	const dispatch = useAppDispatch();
	const fileRef = useRef<HTMLInputElement>(null);

	const isDisabled = !titleInput && isSubmitting;

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTitleInput(event.target.value);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const boardData = new FormData();
			boardData.append("title", titleInput);
			const file = fileRef.current?.files?.[0];

			if (isSubmitting) return;
			setIsSubmitting(true);

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

					return;
				}

				boardData.append("image", file);
			}

			await dispatch(addBoard(boardData));
			onClose(); // Cierra el modal solo si la creación fue exitosa
		} catch (error) {
			console.error(translation("newBoard.error"), error);
			const apiError = error as AxiosError;
			const status = apiError.response?.status;
			const errorData = apiError.response?.data;

			if (status === 403 && errorData) {
				const limitData = errorData as LimitErrorData;
				setLimitErrorData(limitData);
				setShowLimitModal(true);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (showLimitModal && limitErrorData) {
		return (
			<UpgradeModal
				onClose={() => {
					setShowLimitModal(false);
					onClose();
				}}
				message={limitErrorData.message}
			/>
		);
	}

	return (
		<div className="modal-bg">
			<article className="modal-card">
				<CloseButton className="closebtn-form" onClick={onClose} />
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
						disabled={isDisabled || isSubmitting}
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
