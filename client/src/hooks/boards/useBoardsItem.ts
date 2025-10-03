import { useState } from "react";
import { useAppDispatch } from "../../store";
import { deleteBoard, editBoard } from "../../store/boards/actions";
import type { Board, EditBoardsData } from "../../pages/boards/types";

export const useBoardsItem = (board: Board) => {
	const [showConfirm, setShowConfirm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showShareForm, setShowShareForm] = useState(false);
	const dispatch = useAppDispatch();

	const handleShowConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setShowConfirm(true);
	};

	const handleDeleteBoard = async () => {
		if (board) {
			dispatch(deleteBoard(board.id));
		}
	};

	const handleHideMessage = () => setShowConfirm(false);

	const handleShowEditForm = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setShowEditForm(true);
	};

	const handleEditForm = async ({ title, image }: EditBoardsData) => {
		if (board) {
			const formData = new FormData();
			if (title) formData.append("title", title);
			if (image) formData.append("image", image);
			dispatch(editBoard(board.id, formData));
		}
	};

	const handleHideEdit = () => setShowEditForm(false);

	const handleShowShareForm = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setShowShareForm(true);
	};

	const handleCloseShareForm = () => setShowShareForm(false);

	return {
		showConfirm,
		setShowConfirm,
		showEditForm,
		setShowEditForm,
		showShareForm,
		setShowShareForm,
		handleShowEditForm,
		handleDeleteBoard,
		handleCloseShareForm,
		handleShowConfirm,
		handleShowShareForm,
		handleHideEdit,
		handleEditForm,
		handleHideMessage,
	};
};
