import { Link } from "react-router-dom";
import TrashButton from "../../components/ui/trash-button";
import EditButton from "../../components/ui/edit-button";
import ConfirmDelete from "../../components/ui/modals/confirm-delete";
import ShareBoard from "../../components/ui/modals/share-board";
import "./boards-list-item.css";
import { useTranslation } from "react-i18next";
import EditBoard from "../../components/ui/modals/edit-board";
import { randomColor } from "../../lib/randomColor";
import ShareButton from "../../components/ui/share-button";
import { useBoardsItem } from "../../hooks/boards/useBoardsItem";
import type { Board } from "./types";
interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const { t } = useTranslation();
	const hooks = useBoardsItem(board);

	return (
		<>
			{hooks.showConfirm && (
				<ConfirmDelete
					handleDeleteBoard={hooks.handleDeleteBoard}
					handleHideMessage={hooks.handleHideMessage}
					message={t(
						"boardsitem.confirm",
						"¿Seguro que quieres borrar este tablero?",
					)}
				/>
			)}
			{hooks.showEditForm && (
				<EditBoard
					handleEditForm={hooks.handleEditForm}
					handleHideMessage={hooks.handleHideEdit}
				/>
			)}
			{hooks.showShareForm && (
				<ShareBoard
					boardId={board.id}
					handleHideMessage={hooks.handleCloseShareForm}
				/>
			)}
			<li className="board-item">
				<Link to={`/boards/${board.slug}`} className="board-link">
					{board.image ? (
						<div className="img-container">
							<img
								className="board-img"
								src={`${import.meta.env.VITE_BASE_URL}${board.image}_t.webp`}
								alt="board-img"
							/>
						</div>
					) : (
						<div className="img-container">
							<div
								className="board-img"
								style={{ background: randomColor(board.title, true) }}
							></div>
						</div>
					)}
					<div className="title-actions-container">
						<div className="title-container">
							<div className="board-title">{board.title}</div>
						</div>
						<div className="edit-trash-share-wrap">
							<div className="edit-icon container">
								<EditButton showEditForm={hooks.handleShowEditForm} />
							</div>
							<div className="trash-icon container">
								<TrashButton showConfirm={hooks.handleShowConfirm} />
							</div>
							<div className="share-icon container">
								<ShareButton showShareForm={hooks.handleShowShareForm} />
							</div>
						</div>
					</div>
				</Link>
			</li>
		</>
	);
};

export default BoardsItem;
